const INVISIBLE_TAILWIND_CLASS = 'invisible';

export const setupIntersectionObserver = (elementId: string, animationsClass: string[], startInvisible: boolean) => {
  const element = document.querySelector(`#${elementId}`);
  if (!element) return;

  if (startInvisible) {
    element.classList.add(INVISIBLE_TAILWIND_CLASS);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animationsClass.forEach(animationClass => entry.target.classList.add(animationClass));
        entry.target.classList.remove(INVISIBLE_TAILWIND_CLASS);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(element);
}
