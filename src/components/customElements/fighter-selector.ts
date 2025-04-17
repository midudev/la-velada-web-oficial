type moveToParams = {
    top: number
    left: number
    width: number
    height: number
    isInLeft: boolean
}

export class FighterSelector extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' })

    this.style.position = 'absolute'
    this.style.width = 'var(--selector--width)'
    this.style.height = 'var(--selector--height)'
    this.style.top = 'var(--selector--top)'
    this.style.left = 'var(--selector--left)'
    this.style.transitionDuration = '500ms'
    this.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)'
    this.style.transitionProperty = 'all'
    this.style.opacity = '0'
    this.style.zIndex = '40'
    this.style.pointerEvents = 'none'
    this.style.animation = 'fighter-select 0.5s infinite alternate'

    const beforeElement = document.createElement('div')
    beforeElement.style.position = 'absolute'
    beforeElement.style.inset = '-4px'
    beforeElement.style.background = 'transparent'
    beforeElement.style.borderRadius = '8px'
    beforeElement.style.opacity = '1'
    beforeElement.style.zIndex = '30'
    beforeElement.style.animation = 'fighter-select 0.5s infinite alternate'

    const afterElement = document.createElement('div')
    afterElement.style.position = 'absolute'
    afterElement.style.inset = '-4px'
    afterElement.style.zIndex = '30'
    afterElement.style.opacity = '1'
    afterElement.style.background = `
        linear-gradient(to right, #fff 4px, transparent 4px) top left,
        linear-gradient(to bottom, #fff 4px, transparent 4px) top left,
        linear-gradient(to left, #fff 4px, transparent 4px) top right,
        linear-gradient(to bottom, #fff 4px, transparent 4px) top right,
        linear-gradient(to right, #fff 4px, transparent 4px) bottom left,
        linear-gradient(to top, #fff 4px, transparent 4px) bottom left,
        linear-gradient(to left, #fff 4px, transparent 4px) bottom right,
        linear-gradient(to top, #fff 4px, transparent 4px) bottom right`
    afterElement.style.backgroundRepeat = 'no-repeat'
    afterElement.style.backgroundSize = '25px 25px'
    afterElement.style.borderRadius = '8px'
    afterElement.style.animation = 'fighter-select 0.5s infinite alternate'

    shadow.appendChild(beforeElement)
    shadow.appendChild(afterElement)
  }

  moveTo({
    top,
    left,
    width,
    height,
    isInLeft,
  }: moveToParams) {
    this.style.setProperty('--selector--left', `${left}px`)
    this.style.setProperty('--selector--top', `${top}px`)
    this.style.setProperty('--selector--width', `${width}px`)
    this.style.setProperty('--selector--height', `${height}px`)

    this.style.transform = isInLeft ? 'skew(2deg) scale(1.05)' : 'skew(-2deg) scale(1.05)'

    this.style.opacity = '1'
    this.style.visibility = 'visible'
  }

  hide() {
    this.style.transform = 'scale(1)'
    this.style.opacity = '0'
    this.style.visibility = 'hidden'
  }
}

customElements.define('fighter-selector', FighterSelector)
