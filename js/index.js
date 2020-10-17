customElements.define("block-square-area", 
class BlockSquareArea extends HTMLElement {
    constructor() {
        super();

        this.rows = 80;
        this.cols = 80;
        document.query

        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot.appendChild(BlockSquareArea.template.content.cloneNode(true));
        this.render();
    }

    render() {
        const blocks = document.createDocumentFragment();
        this.blockArr = [];
        for (let x = 0; x < this.cols; x++) {
            this.blockArr[x] = [];
            for (let y = 0; y < this.rows; y++) {
                const block = document.createElement("block-square");
                this.blockArr[x][y] = block;
                block.addEventListener("transitionend", () => this.handleTransitionEnd(block));
                block.addEventListener("click", () => this.doRipple(x, y));
                blocks.appendChild(block);
            }
        }
        this.shadowRoot.innerHTML = this.shadowRoot.innerHTML
            .replace("BLOCK_WIDTH", 100 / this.cols)
            .replace("BLOCK_HEIGHT", 100 / this.rows);
        this.shadowRoot.appendChild(blocks);
    }

    async doRipple(x, y) {
        const distanceList = [];
        for (let nx = 0; nx < this.cols; nx++) {
            distanceList[nx] = [];
            for (let ny = 0; ny < this.rows; ny++) {
                const b = this.blockArr[nx][ny];
                this.handleTransitionEnd(b);
                const dy = Math.max(ny, y) - Math.min(ny, y)
                const dx = Math.max(nx, x) - Math.min(nx, x);
                const dplus = (Math.max(dx, dy) - Math.min(dx, dy)) / 2.25;
                const distance = dx + dy + dplus;
                distanceList[nx][ny] = distance;
            }
        }

        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                const b = this.blockArr[c][r];
                const distance = distanceList[c][r];
                b.setAttribute("ripple", "")
                b.style.setProperty("--distance", distance);
            }
        }
    } 

    newFrame() {
        return new Promise(resolve => window.requestAnimationFrame(resolve));
    }

    handleTransitionEnd(b) {
        b.removeAttribute("ripple");
        b.removeAttribute("style");
        b.removeAttribute("clicked");
    }
 
    static get template() {
        const template = document.createElement("template")
        template.innerHTML = `
<style>
    :host {
        display: flex;
        flex-wrap: wrap;
        height: 800px;
        width: 800px;
        --trans-speed: 30ms;
        --wave-size: 6;
    }

    block-square {
        cursor: pointer;
        width: BLOCK_WIDTH%;
        height: BLOCK_HEIGHT%;
        border: 1px solid #000;
        box-sizing: border-box;
        background-color: #FFF;
        transition: calc(var(--trans-speed) * var(--wave-size)) ease-in;
        transition-delay: calc(var(--distance) * var(--trans-speed));
        will-change: background-color;
    }

    block-square[ripple] {
        background-color: #00bcd4;
        transition: var(--trans-speed);
        transition-delay: calc(var(--distance) * var(--trans-speed));
    }

</style>
        `;
        return template;
    }
});

customElements.define("block-square", class BlockSquare extends HTMLElement {});
