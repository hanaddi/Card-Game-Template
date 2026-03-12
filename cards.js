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
        static cardWidth  = 100;
        /** @type {number} Default card height in pixels. */
        static cardHeight = 160;

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
         * TODO: param {function|null} [args.createDom]
         * TODO: add doc for new params
         */
        constructor(args = {}) {
            const options = {
                cardName  : "card",
                colorBg   : "white",
                imgBg     : null,
                createDom : null,
                isOpen    : true, // Is the card face open
                ...args,
            };
            this.cardName = options.cardName;
            this.colorBg  = options.colorBg;
            this.imgBg    = options.imgBg;
            this.isOpen   = options.isOpen;

            if (options.createDom) {
                this.createDom = options.createDom;
            }

            this.dom  = null;
            this.uid  = null;
            this.slot = null;
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
            this.dom.classList.add(this.isOpen? "card-open" : "card-close");

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

        // TODO: add documentation
        faceFlip() {
            this.isOpen = !this.isOpen;
            this.dom.classList.remove(!this.isOpen? "card-open" : "card-close");
            this.dom.classList.remove("flip");
            void this.dom.offsetWidth; // force reflow
            this.dom.classList.add(this.isOpen? "card-open" : "card-close");
            this.dom.classList.add("flip");
        }

        // TODO: add documentation
        faceOpen() {
            this.isOpen = false;
            return this.faceFlip();
        }

        // TODO: add documentation
        faceClose() {
            this.isOpen = true;
            return this.faceFlip();
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
    }

    class Slot {
        static instances = [];

        constructor(args = {}) {
            const options = {
                ...args,
            };
            this.pile = options.pile || [];
            this.size = options.size;
            this.type = options.type;
            this.domType = options.domType;
            this.domPile = options.domPile;
            this.slotName = options.slotName;

            this.domSelector = null;

            Slot.instances.push(this);
        }
    }

    let slotsMoveSelection = null;

    /**
     * Opens a selection UI for choosing which slot to move a card into.
     * @param {Card} card - The card to move.
     * @param {Array<Slot>} slotTargets - Available destination slots.
     * @param {Slot|null} [slotSource=null] - The slot the card originates from.
     * @param {function|null} [callback=null] - Called after the card has been moved.
     */
    function cardMoveSelection(card, slotTargets, slotSource = null, callback = null) {

        if (slotsMoveSelection) {
            cardMoveSelectionCancel(slotsMoveSelection);
        }
        slotsMoveSelection = slotTargets;

        slotTargets.forEach(slotTarget => {
            if (slotTarget != slotSource && slotTarget.type == "list" && slotTarget.size > 0 && slotTarget.pile.length >= slotTarget.size) {
                // pile is full
                return;
            }
            if (!slotTarget.domSelector) {
                slotTarget.domSelector = document.createElement("div");
                slotTarget.domSelector.classList.add("deckselect");
            }
            if (slotTarget == slotSource) {
                // will move to itself
                slotTarget.domSelector.innerHTML = "Cancel";
                slotTarget.domSelector.style.fontSize = "1rem";
                slotTarget.domSelector.style.animation = "none";
            } else {
                slotTarget.domSelector.innerHTML = "&#x2B07;";
                slotTarget.domSelector.style.removeProperty("font-size");
                slotTarget.domSelector.style.removeProperty("animation");
                slotTarget.domPile.appendChild(slotTarget.domSelector);
            }
            if (!callback) callback = cardMove;
            slotTarget.domSelector.onclick = () => {
                if (slotTarget == slotSource) {
                    // move to itself, cancel the operation
                    cardMoveSelectionCancel(slotTargets);
                    return;
                }
                callback(card, slotSource, slotTarget);

                if (slotTarget.domType === "list") {
                    slotAdjustCards(slotTarget);
                }
                if (slotSource && slotSource.domType === "list") {
                    slotAdjustCards(slotSource);
                }

                cardMoveSelectionCancel(slotTargets);
            };
            // slotTarget.domPile.appendChild(slotTarget.domSelector);
        });
    }

    /**
     * Dismisses the selection UI by removing each slot's selector element from the DOM.
     * @param {Array<Slot>} slotTargets - The slots whose selector elements should be removed.
     */
    function cardMoveSelectionCancel(slotTargets) {
        slotTargets.forEach(objSlot => {
            if (objSlot.domSelector && objSlot.domPile.contains(objSlot.domSelector)) {
                objSlot.domPile.removeChild(objSlot.domSelector);
            }
        });
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
        card.dom.classList.remove('carddraw');
        card.dom.classList.remove("flip");
        void card.dom.offsetWidth;

        card.dom.style.marginRight = "0";
        let bbox1 = { x: 0, y: 0 }, bbox2 = { x: 0, y: 0 };

        // remove from source
        if (slotSource) {
            if (slotSource.type == 'list') {
                const idx1 = slotSource.pile.indexOf(card);
                if (idx1 >= 0) {
                    slotSource.pile.splice(idx1, 1);
                    bbox1 = card.dom.getBoundingClientRect();
                    if (slotSource.domType == 'list') {

                        // Poor animation
                        const clone = card.dom.cloneNode(false);
                        clone.style.opacity = "0";
                        clone.style.pointerEvent = "none";
                        slotSource.domPile.insertBefore(clone, card.dom);
                        clone.style.transitionDuration = "1s";
                        window.setTimeout(()=>{
                            clone.style.borderWidth = "0px";
                            clone.style.width = "0px";
                            clone.style.height = "0px";
                        }, 10);
                        window.setTimeout(()=>{
                            slotSource.domPile.removeChild(clone);
                        }, 2000);

                        slotSource.domPile.removeChild(card.dom);
                    } else if (slotSource.domType == 'slot-open') {
                        slotSource.domPile.replaceChildren(document.createTextNode(''));
                    }
                }
            } else if (slotSource.type == 'slot') {
                slotSource.pile = null;
            }
        }

        // add to target
        if (slotTarget) {
            if (slotTarget.type == 'list') {
                slotTarget.pile.push(card);
                if (slotTarget.domType == 'list') {
                    slotTarget.domPile.appendChild(card.dom);
                } else if (slotTarget.domType == 'slot-open') {
                    slotTarget.domPile.replaceChildren(card.dom);
                }
                bbox2 = card.dom.getBoundingClientRect();
            } else if (slotTarget.type == 'slot') {
                slotTarget.pile = card;
            }
        }

        // // Adjust card menu
        // setCardMenu(card, slotTarget, window.playerCode);

        bbox1 = card.bbox || bbox1;
        // if (["deck1", "deck2", "recycle1", "recycle2"].includes(slotSource.name)) {
        //     bbox1 = slotSource.domPile.getBoundingClientRect();
        // }
        card.dom.style.setProperty('--animfromx', `${(bbox1.x || bbox2.x) - bbox2.x}px`);
        card.dom.style.setProperty('--animfromy', `${(bbox1.y || bbox2.y) - bbox2.y}px`);
        card.bbox = bbox2;
        card.dom.classList.add('carddraw');

        card.slot = slotTarget;

        // updateCopies();
    }

    /**
     * Adjusts the horizontal spacing of cards in a list-type slot.
     * When the pile exceeds the stacking threshold, each card's
     * right margin is set to a negative value so they overlap and
     * fit within the available space.
     * @param {Slot} slot - The slot whose cards should be repositioned.
     */
    function slotAdjustCards(slot) {
        const maxCardUnstack = 7;
        const pile = slot.pile;
        pile.forEach(card => {
            if (!card.dom) {
                domCreateCard(card);
            }

            if (pile.length <= maxCardUnstack) {
                card.dom.style.marginRight = "0px";
            } else {
                const cardWidth = card.dom.offsetWidth;
                const ratio = 1 - maxCardUnstack / pile.length;
                card.dom.style.marginRight = `${-cardWidth * ratio}px`;
            }
        });
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

        cardMoveSelection: cardMoveSelection,
        cardMoveSelectionCancel: cardMoveSelectionCancel,
        cardMove: cardMove,
        slotAdjustCards: slotAdjustCards,
        domMenuShow: domMenuShow,
    };

})(window);