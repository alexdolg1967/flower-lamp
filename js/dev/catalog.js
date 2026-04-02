import "./main.min.js";
import "./sectioncatalog.min.js";
import "./breadcrumbs.min.js";
import "./common.min.js";
const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -30px 0px"
  }
);
revealItems.forEach(function(item, index) {
  if (!item.classList.contains("visible")) {
    item.style.transitionDelay = Math.min(index * 0.08, 0.32) + "s";
  }
  observer.observe(item);
});
