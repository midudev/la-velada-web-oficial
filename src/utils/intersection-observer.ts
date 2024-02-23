export const setupIntersectionObserver = (elementId: string, animationClass: string, startInvisible: boolean) => {
  const element = document.querySelector(`#${elementId}`);
  if (!element) return;

  if (startInvisible) {
    element.classList.add("invisible");
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass);
        entry.target.classList.remove("invisible");
      }
    });
  }, { threshold: 0.2 });

  observer.observe(element);
}
