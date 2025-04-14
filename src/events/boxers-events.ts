export class BoxerCardHoveredEvent extends CustomEvent<{ id: string }> {
  constructor(id: string) {
    super('boxer-card-hovered', { detail: { id } })
  }
}

export class BoxerCardExitEvent extends CustomEvent<null> {
  constructor() {
    super('boxer-card-exit')
  }
}
