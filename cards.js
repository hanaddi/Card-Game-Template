(function (window) {

    /**
     * Represents a playing card with a visual DOM element.
     * @property {string} cardName - Display name of the card.
     * @property {string} colorBg - Background color of the card.
     * @property {string|null} imgBg - Background image URL, if any.
     * @property {HTMLDivElement|null} dom - The card's root DOM element, created by {@link Card#createDom}.
     * @property {string|null} uid - Unique identifier, generated on first {@link Card#createDom} call.
     * @property {HTMLDivElement} domMenu - Container element reserved for a context menu.
     */
    class Card {

        /** @type {number} Default card width in pixels. */
        static cardWidth = 100;
        /** @type {number} Default card height in pixels. */
        static cardHeight = 160;

        static maxCards = 2000;

        /**
         * Applies {@link Card.cardWidth} and {@link Card.cardHeight} as CSS custom properties
         * (`--cardwidth`, `--cardheight`) on the document root.
         */
        static setCSS() {
            document.documentElement.style.setProperty('--cardwidth', `${Card.cardWidth}px`);
            document.documentElement.style.setProperty('--cardheight', `${Card.cardHeight}px`);
        }

        /**
         * Creates a new Card instance.
         * @param {Object} [args={}] - Card properties.
         * @param {string} [args.cardName="card"] - Display name of the card.
         * @param {string} [args.colorBg="white"] - Background color.
         * @param {string|null} [args.imgBg=null] - Background image URL.
         * @param {function|null} [args.createDom=null] - Custom function to replace the default {@link Card#createDom} method.
         * @param {boolean} [args.isOpen=true] - Whether the card starts face-up (`true`) or face-down (`false`).
         * @param {Object} [args.style={}] - Inline styles to apply to the card's DOM element.
         */
        constructor(args = {}) {
            const options = {
                cardName: "card",
                colorBg: "white",
                imgBg: null,
                createDom: null,
                isOpen: true, // Is the card face open
                style: {},
                ...args,
            };
            this.cardName = options.cardName;
            this.colorBg = options.colorBg;
            this.imgBg = options.imgBg;
            this.isOpen = options.isOpen;
            this.style = options.style;
            this.onAfterMove = options.onAfterMove || null;

            if (options.createDom) {
                this.createDom = options.createDom;
            }

            this.dom = null;
            this.uid = null;
            this.slot = null;
        }

        get _dom() {
            if (!this.dom) {
                this.createDom();
            }
            return this.dom;
        }

        /**
         * Builds (or rebuilds) the card's DOM element, assigning a unique ID on the
         * first call and rendering the card name, background image, and background color.
         */
        createDom() {
            // set uid
            if (!this.uid) {
                this.uid = "$" + (Date.now() % 1000000000).toString(36) + "$" + (Math.random() * 999999 | 0).toString(36);
            }

            this.dom ??= document.createElement("div");
            this.dom.className = "card";
            this.dom.classList.add(this.isOpen ? "card-open" : "card-close");
            this.dom.ctCard = this;

            // Front face
            this.domFront ??= document.createElement("div");
            this.domFront.classList.add("face-front");
            this.dom.appendChild(this.domFront);

            this.dom.domText ??= document.createElement("span");
            this.dom.domText.style.textAlign = "center";
            this.dom.domText.textContent = this.cardName;
            this.domFront.appendChild(this.dom.domText);

            if (this.imgBg) {
                this.dom.style.backgroundImage = `url(${this.imgBg})`;
                this.dom.style.backgroundSize = 'cover';
                this.dom.style.backgroundPosition = 'center';
                // this.dom.domText.style.backgroundColor = '#ffffffee';
                // this.dom.domText.style.padding = '10px';
                // this.dom.domText.style.borderRadius = '5px';
            }

            if (this.colorBg) {
                this.dom.style.backgroundColor = this.colorBg;
            }

            // Back face
            this.domBack ??= document.createElement("div");
            this.domBack.classList.add("face-back");
            this.domBack.style.backgroundColor = "yellow";
            this.dom.appendChild(this.domBack);
            this.domBack.innerHTML = `<div>Back</div>`;

            // if (card.hasOwnProperty('hpVal')) {
            //     const domHp = document.createElement('div');
            //     domHp.textContent = card.hpVal;
            //     domHp.setAttribute('style', 'position: absolute; left: 0; top: 0; padding: 3px; background: crimson; color: white; border-radius: 50%;');
            //     card.dom.appendChild(domHp);
            // }

            // if (card.hasOwnProperty('atkVal')) {
            //     const dom = document.createElement('div');
            //     dom.textContent = card.atkVal;
            //     dom.setAttribute('style', 'position: absolute; right: 0; top: 0; padding: 3px; background: darkorange; color: white; border-radius: 50%;');
            //     card.dom.appendChild(dom);
            // }

            this.domMenu = document.createElement("div");
            this.domMenu.classList.add("cardmenu");
            this.dom.appendChild(this.domMenu);
            // card.dom.addEventListener("mouseover", () => showCardDetails(card));

            // Enable moving card
            this.domMenuMove = document.createElement("div");
            this.domMenuMove.classList.add("cardmenuitem");
            this.domMenuMove.textContent = "Move";
            this.domMenuMove.onclick = () => {
                cardMoveSelection(this, Slot.instances, this.slot || null);
                window.setTimeout(() => domMenuShow(null, document.querySelectorAll("div:has(.cardmenu)")), 50);
            }
            this.domMenu.appendChild(this.domMenuMove);

        }

        /**
         * Moves this card to the given slot, removing it from its current slot
         * if present. Delegates to {@link cardMove}.
         * @param {Slot|null} [slotTarget=null] - The destination slot.
         */
        move(slotTarget = null) {
            const moveResult = cardMove(this, this.slot || null, slotTarget);

            if (this.onAfterMove) {
                this.onAfterMove();
            }

            return moveResult;
        }

        /**
         * Toggles the card between face-up and face-down, swapping the
         * `card-open` / `card-close` classes and triggering the flip
         * animation when {@link isAnim} is `true`.
         * @param {boolean} [isAnim=true] - Whether to play the flip animation.
         */
        faceFlip(isAnim = true) {
            if (isAnim) {
                this.dom.style.removeProperty("animation");
            }
            this.isOpen = !this.isOpen;
            this.dom.classList.remove(!this.isOpen ? "card-open" : "card-close");
            this.dom.classList.remove("flip");
            void this.dom.offsetWidth; // force reflow
            this.dom.classList.add(this.isOpen ? "card-open" : "card-close");
            this.dom.classList.add("flip");
        }

        /**
         * Flips the card to its face-up state. If the card is already
         * face-up this still performs a flip (closed then opened).
         * @param {boolean} [isAnim=true] - Whether to play the flip animation.
         */
        faceOpen(isAnim = true) {
            this.isOpen = false;
            return this.faceFlip(isAnim);
        }

        /**
         * Flips the card to its face-down state. If the card is already
         * face-down this still performs a flip (opened then closed).
         * @param {boolean} [isAnim=true] - Whether to play the flip animation.
         */
        faceClose(isAnim = true) {
            this.isOpen = true;
            return this.faceFlip(isAnim);
        }

        /**
         * Adds the `card-highlight` CSS class to the card's DOM element,
         * giving it an animated gold-and-orange glow.
         */
        highlightOn() {
            this.dom.classList.add("card-highlight");
        }

        /**
         * Removes the `card-highlight` CSS class from the card's DOM element,
         * returning it to its default appearance.
         */
        highlightOff() {
            this.dom.classList.remove("card-highlight");
        }

        /**
         * Destroys this card instance, removing it from its slot, detaching its
         * DOM element, and nullifying all references for garbage collection.
         */
        destroy() {
            if (this.slot) {
                this.move(null);
                // this.slot.pile.delete(this);
                // this.slot.tidy();
                // this.slot = null;
            }

            if (this.dom) {
                this.dom.ctCard = null;
                this.dom.remove();
                this.dom = null;
            }

            this.domFront = null;
            this.domBack = null;
            this.domMenu = null;
            this.domMenuMove = null;
            this.uid = null;
        }
    }

    // TODO: Add documentation for this class
    class Slot {
        static instances = [];

        constructor(args = {}) {
            const options = {
                ...args,
            };
            this.size = options.size;
            this.type = options.type;
            this.domType = options.domType;
            this.domPile = options.domPile;
            this.slotName = options.slotName;
            this.isAllowSwap = options.isAllowSwap ?? false;

            this.domSelector = null;
            this.domPile.ctSlot = this;

            Slot.instances.push(this);


            this.pile = new Set(options.pile || []);

            this.widthCard = options.widthCard ?? 1;
            this.heightCard = options.heightCard ?? 1;

            this.domPile.style.width = (this.widthCard * CT.Card.cardWidth) + "px";
            this.domPile.style.height = (this.heightCard * CT.Card.cardHeight) + "px";
        }

        /**
         * Destroys this slot instance, removing all cards from the pile,
         * detaching itself from {@link Slot.instances}, and cleaning up DOM references.
         */
        destroy() {
            for (const card of this.pile) {
                // card.slot = null;
                // if (card.dom) {
                //     card.dom.remove();
                // }
                card.destroy();
            }
            this.pile.clear();

            const idx = Slot.instances.indexOf(this);
            if (idx !== -1) {
                Slot.instances.splice(idx, 1);
            }

            if (this.domPile) {
                this.domPile.ctSlot = null;
                this.domPile = null;
            }

            this.domSelector = null;
        }

        // TODO: Add documentation for this method
        tidy() {
            if (this.heightCard > 1) {
                this.tidyY();
            } else if (this.widthCard  > 1) {
                this.tidyX();
            } else {
                const cards = [...this.pile];
                for(const i in cards) {
                const card = cards[i];
                card.dom.style["z-index"] = i;
                card.slotIndex = i;

                card.left = 0;
                card.top = 0;
                card.dom.style.left = card.left + "px";
                card.dom.style.top = card.top + "px";
                card.dom.style.removeProperty("transition-duration");
                }
            }
        }

        // TODO: Add documentation for this method
        tidyX() {
            const slot = this;
            if (slot.pile.size === 0) return;
            const cards = [...slot.pile].sort((a, b) => {
                const aBox = a.bBox || a.dom.getBoundingClientRect();
                const bBox = b.bBox || b.dom.getBoundingClientRect();
                if (aBox.x < bBox.x) {
                }
                a.bBox = null;
                b.bBox = null;
                return aBox.x - bBox.x;
            })

            const offsetUnit = Math.min(1, slot.pile.size === 1 ? 1 : (slot.widthCard - 1) / (slot.pile.size - 1));
            for (const i in cards) {
                const card = cards[i];
                card.dom.style["z-index"] = i;
                card.slotIndex = i;

                card.left = i * offsetUnit * CT.Card.cardWidth;
                card.top = 0;
                card.dom.style.left = card.left + "px";
                card.dom.style.top = card.top + "px";
                card.dom.style.removeProperty("transition-duration");
            }
        }

        // TODO: Add documentation for this method
        tidyY() {
            const slot = this;
            if (slot.pile.size === 0) return;
            const cards = [...slot.pile].sort((a, b) => {
                const aBox = a.bBox || a.dom.getBoundingClientRect();
                const bBox = b.bBox || b.dom.getBoundingClientRect();
                if (aBox.y < bBox.y) {
                }
                a.bBox = null;
                b.bBox = null;
                return aBox.y - bBox.y;
            })

            const offsetUnit = Math.min(1, slot.pile.size === 1 ? 1 : (slot.heightCard - 1) / (slot.pile.size - 1));
            for (const i in cards) {
                const card = cards[i];
                card.dom.style["z-index"] = i;
                card.slotIndex = i;

                card.top = i * offsetUnit * CT.Card.cardHeight;
                card.left = 0;
                card.dom.style.left = card.left + "px";
                card.dom.style.top = card.top + "px";
                card.dom.style.removeProperty("transition-duration");
            }
        }
    }

    class Dragger {
        offsetX = 0;
        offsetY = 0;
        cardMoving = null;
        slotsHover = new Set();

        constructor(args = {}) {
            const options = {
                ...args,
            };
            this.cards = new Set(options.cards || []);
            this.slots = new Set(options.slots || []);

            this.isCardAllowPick = options.isCardAllowPick ?? (() => true)
            this.isSlotAllowDrop = options.isSlotAllowDrop ?? (() => true)

            for (const card of this.cards) {
                this.prepareCard(card);
            }

            for (const slot of this.slots) {
                this.prepareSlot(slot);
            }
        }

        addCards() {
            for (const card of arguments) {
                this.cards.add(card);
                this.prepareCard(card);
            }
        }

        prepareCard(card) {
            // console.log("card", card);
            card.isAllowPick = () => this.isCardAllowPick(card);

            if (!card.dom) {
                card.createDom();
            }
            
            card.dom.addEventListener("pointerdown",   this.cardFuncOnPointerDown.bind(this));
            card.dom.addEventListener("pointermove",   this.cardFuncOnPointerMove.bind(this));
            card.dom.addEventListener("pointerup",     this.cardFuncOnPointerUp.bind(this));
            card.dom.addEventListener("pointercancel", this.cardFuncOnPointerCancel.bind(this));
        }

        prepareSlot(slot) {
            slot.isAllowDrop = (card) => this.isSlotAllowDrop(slot, card)
        }
        
        cardFuncOnPointerDown(ev) {
            if (this.cardMoving) return;
            let el = ev.target;
            while (!el.ctCard) {
                if (!el.parentElement) return;
                el = el.parentElement;
            }
            if (!el.ctCard.isAllowPick()) return;

            el.style["transition-duration"] = "0s";
            el.classList.remove("flip");
            el.style["z-index"] = CT.Card.maxCards;
            el.style["animation"] = "none";
            el.setPointerCapture(ev.pointerId);
            this.cardMoving = el;

            this.offsetX = ev.clientX;
            this.offsetY = ev.clientY;
        }

        slotsHoverUpdate(x, y) {
            const elsHover = document.elementsFromPoint(x, y);
            const slotsHoverNew = new Set();
            for (const elHover of elsHover) {
                if (!elHover.ctSlot) {
                    // Not a slot
                    continue;
                }
                const slot = elHover.ctSlot;
                if (!slot.isAllowDrop(this.cardMoving.ctCard)) {
                    continue;
                }

                slot.domPile.classList.add("deckallow");
                slotsHoverNew.add(slot);
            }
            for (const slotHover of this.slotsHover) {
                if (!slotsHoverNew.has(slotHover)) {
                    slotHover.domPile.classList.remove("deckallow");
                }
            }
            this.slotsHover = slotsHoverNew;
        }

        slotsHoverReset() {
            for (const slotHover of this.slotsHover) {
                slotHover.domPile.classList.remove("deckallow");
            }
            this.slotsHover.clear();

        }

        cardFuncOnPointerMove(ev) {
            if (ev.pressure === 0) {
                this.cardMoving = null;
                return;
            }
            if (!this.cardMoving) {
                return;
            }
            this.slotsHoverUpdate(ev.clientX, ev.clientY);

            const tx = ev.clientX - this.offsetX;
            const ty = ev.clientY - this.offsetY;
            this.cardMoving.ctCard.style["z-index"] = CT.Card.maxCards;
            this.cardMoving.ctCard.left ??= 0;
            this.cardMoving.ctCard.top  ??= 0;
            this.cardMoving.style.left = (this.cardMoving.ctCard.left + tx) + "px";
            this.cardMoving.style.top  = (this.cardMoving.ctCard.top + ty) + "px";
        }

        cardFuncOnPointerUp(ev) {
            this.slotsHoverReset();
            if (!this.cardMoving) {
                return;
            }

            let el = this.cardMoving;
            this.cardMoving = null;
            el.style.pointerEvents = "none";

            const targets = document.elementsFromPoint(ev.clientX, ev.clientY);
            el.style.removeProperty("pointer-events");
            let isTidy = true;
            for (const target of targets) {
                if (!target.ctSlot) continue;
                if (el.ctCard.slot == target.ctSlot) continue; // to itself
                if (!target.ctSlot.isAllowDrop(el.ctCard)) continue; // not allowed
            //     if (target.ctSlot.pile.size >= target.ctSlot.size) {
            //         isTidy = false;
            //         continue; // full
            //     }

                if (target.ctSlot.pile.size >= target.ctSlot.size && target.ctSlot.isAllowSwap) {
                    // Swap the first card
                    const card = [...target.ctSlot.pile][0];
                    const slot = el.ctCard.slot;
                    window.setTimeout(card.move.bind(card), 10, slot);
                }

                const tx = ev.clientX - this.offsetX;
                const ty = ev.clientY - this.offsetY;
                el.ctCard.left += tx;
                el.ctCard.top += ty;

                el.style.removeProperty("transition-duration");
                el.ctCard.move(target.ctSlot);
                return;
            }

            el.style.removeProperty("transition-duration");
            if (isTidy) {
                el.ctCard.slot.tidy();
            }
            el.style["z-index"] = el.ctCard.slotIndex;
            el.style.left = el.ctCard.left + "px";
            el.style.top = el.ctCard.top + "px";

        }

        cardFuncOnPointerCancel(ev) {
            this.slotsHoverReset();
            if (!this.cardMoving) return;
            this.cardMoving.style.removeProperty("transition-duration");
            this.cardMoving.style["z-index"] = this.cardMoving.ctCard.slotIndex;
            this.cardMoving.style.left = this.cardMoving.ctCard.left + "px";
            this.cardMoving.style.top  = this.cardMoving.ctCard.top  + "px";
            this.cardMoving = null;
        }

    }


    /**
     * Moves a card from one slot to another, updating both the data model and the DOM,
     * and animates the transition between the source and target positions.
     * @param {Card} card - The card to move. If falsy, the function is a no-op.
     * @param {Slot|null} [slotSource=null] - The slot to remove the card from.
     * @param {Slot|null} [slotTarget=null] - The slot to place the card into.
     */
    function cardMove(card, slotSource = null, slotTarget = null) {
        if (!card) {
            return;
        }
        if (!card.dom) {
            card.createDom();
        }

        if (slotSource && slotSource.pile.has(card)) {
            slotSource.pile.delete(card);
            card.slot = null;
            slotSource.domPile.removeChild(card.dom);
            slotSource.tidy();
        }

        if (slotTarget) {
            slotTarget.pile.add(card);
            card.slot = slotTarget;
            slotTarget.domPile.appendChild(card.dom);

            card.left ??= 0;
            card.top ??= 0;
            if (slotSource) {
                const bBoxSource = slotSource.domPile.getBoundingClientRect();
                const bBoxTarget = slotTarget.domPile.getBoundingClientRect();

                card.left += bBoxSource.x - bBoxTarget.x;
                card.top += bBoxSource.y - bBoxTarget.y;
            } else {
                card.left = (slotTarget.widthCard - .99) * CT.Card.cardWidth
            }
            card.dom.style["transition-duration"] = "0s";
            card.dom.style.left = card.left + "px";
            card.dom.style.top = card.top + "px";
            window.setTimeout(slotTarget.tidy.bind(slotTarget), 10);

        }
    }

    function domMenuShow(dom, nodeList = []) {
        nodeList.forEach(element => {
            if (!element.contains(dom)) {
                if (element.querySelector(".cardmenu")) {
                    // domMenuHide(element.querySelector(".cardmenu"));
                    element.querySelector(".cardmenu").style.display = "none";
                }
            }
        });

        if (dom) {
            dom.style.display = "flex";
        }
    }

    window.CT = {
        Card: Card,
        Slot: Slot,
        Dragger: Dragger,
        cardMove: cardMove,
        domMenuShow: domMenuShow,
    };

})(window);