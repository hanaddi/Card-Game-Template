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
         */
        constructor(args = {}) {
            const options = {
                cardName : "card",
                colorBg  : "white",
                imgBg    : null,
                ...args,
            };
            this.cardName = options.cardName;
            this.colorBg  = options.colorBg;
            this.imgBg    = options.imgBg;

            this.dom = null;
            this.uid = null;
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

            this.dom.domText ??= document.createElement("span");
            this.dom.domText.style.textAlign = "center";
            this.dom.domText.textContent = this.cardName;
            this.dom.appendChild(this.dom.domText);

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
            // card.domMenu.classList.add("cardmenu");
            // card.dom.appendChild(card.domMenu);
            // card.dom.addEventListener("mouseover", () => showCardDetails(card));

        }
    }

    class Slot {
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
        }
    }

    /**
     * Opens a selection UI for choosing which slot to move a card into.
     * @param {Card} card - The card to move.
     * @param {Array<Slot>} slotTargets - Available destination slots.
     * @param {Slot|null} [slotSource=null] - The slot the card originates from.
     * @param {function|null} [callback=null] - Called after the card has been moved.
     */
    function cardMoveSelection(card, slotTargets, slotSource = null, callback = null) {

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
            }
            if (!callback) callback = cardMove;
            // if (!callback) callback = () => { };
            slotTarget.domSelector.onclick = () => {
                if (slotTarget == slotSource) {
                    // move to itself, cancel the operation
                    cardMoveSelectionCancel(slotTargets);
                    return;
                }
                callback(card, slotSource, slotTarget);
                // TODO: Implement later
                // if ([slotTarget, slotSource].includes(moveableObj.hand1.pile)) {
                //     domAdjustCardsInHand(moveableObj.hand1.pile);
                // }
                // if ([slotTarget, slotSource].includes(moveableObj.hand2.pile)) {
                //     domAdjustCardsInHand(moveableObj.hand2.pile);
                // }
                cardMoveSelectionCancel(slotTargets);
            };
            slotTarget.domPile.appendChild(slotTarget.domSelector);
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

        // // Adjust visibility
        // if (["hand2", "hand1", "deck1", "deck2", "tactical1", "tactical2"].includes(slotTarget.name)) {
        //     card.visibility = [mapSlotName[slotTarget.name]];
        // }
        // if (["hero1_1", "hero2_1", "hero1_2", "hero2_2", "hero1_3", "hero2_3", "recycle1", "recycle2"].includes(slotTarget.name)) {
        //     card.visibility = ['p1', 'p2'];
        // }

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

    window.CT = {
        Card: Card,
        Slot: Slot,

        cardMoveSelection: cardMoveSelection,
        cardMoveSelectionCancel: cardMoveSelectionCancel,
        cardMove: cardMove,
    };

})(window);