import { d as bodyLockToggle, b as bodyLockStatus } from "./common.min.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function menuInit() {
  document.addEventListener("click", function(e) {
    if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
      bodyLockToggle();
      document.documentElement.toggleAttribute("data-fls-menu-open");
    }
  });
}
document.querySelector("[data-fls-menu]") ? window.addEventListener("load", menuInit) : null;
const menuList = document.querySelector(".header .menu__list");
window.addEventListener("scroll", () => {
  document.querySelectorAll("section").forEach((sec) => {
    let menuLink = menuList.querySelector(
      `.menu__item:has(a[href="#${sec.id}"])`
    );
    if (window.scrollY >= sec.offsetTop - document.querySelector(".header").offsetHeight && window.scrollY < sec.offsetTop + sec.offsetHeight) {
      menuLink?.classList.add("menu__item--active");
    } else {
      menuLink?.classList.remove("menu__item--active");
    }
  });
});
const getHeaderHeight = () => {
  const headerHeight = document?.querySelector(".header").offsetHeight;
  document.querySelector(":root").style.setProperty("--header-height", `${headerHeight}px`);
};
getHeaderHeight();
window.addEventListener("resize", function() {
  getHeaderHeight();
});
const documentBody = document.querySelector("html");
const headerMenu = document.querySelector(".header__menu .menu__list");
const headerMenuLinks = headerMenu.querySelectorAll(".menu__item > a");
headerMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    documentBody.removeAttribute("data-fls-menu-open");
    documentBody.removeAttribute("data-fls-scrollblock");
  });
});
function headerScroll() {
  const header = document.querySelector("[data-fls-header-scroll]");
  const headerShow = header.hasAttribute("data-fls-header-scroll-show");
  const headerShowTimer = header.dataset.flsHeaderScrollShow ? header.dataset.flsHeaderScrollShow : 500;
  const startPoint = header.dataset.flsHeaderScroll ? header.dataset.flsHeaderScroll : 1;
  let scrollDirection = 0;
  let timer;
  document.addEventListener("scroll", function(e) {
    const scrollTop = window.scrollY;
    clearTimeout(timer);
    if (scrollTop >= startPoint) {
      !header.classList.contains("--header-scroll") ? header.classList.add("--header-scroll") : null;
      if (headerShow) {
        if (scrollTop > scrollDirection) {
          header.classList.contains("--header-show") ? header.classList.remove("--header-show") : null;
        } else {
          !header.classList.contains("--header-show") ? header.classList.add("--header-show") : null;
        }
        timer = setTimeout(() => {
          !header.classList.contains("--header-show") ? header.classList.add("--header-show") : null;
        }, headerShowTimer);
      }
    } else {
      header.classList.contains("--header-scroll") ? header.classList.remove("--header-scroll") : null;
      if (headerShow) {
        header.classList.contains("--header-show") ? header.classList.remove("--header-show") : null;
      }
    }
    scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
  });
}
document.querySelector("[data-fls-header-scroll]") ? window.addEventListener("load", headerScroll) : null;
function initParallax() {
  const profileImage = document.getElementById("profileImage");
  if (!profileImage) return;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.3;
        const maxOffset = 100;
        const offset = Math.min(scrolled * parallaxSpeed, maxOffset);
        if (profileImage) {
          profileImage.style.transform = `translateY(${offset}px)`;
        }
        const gridBg = document.querySelector(".code-grid-bg");
        if (gridBg) {
          gridBg.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}
function initSmoothScroll() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.menu__item a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const headerHeight = document.querySelector(".main-header").offsetHeight;
        console.log("headerHeight: " + headerHeight);
        const targetPosition = targetSection.offsetTop - headerHeight;
        if (typeof anime !== "undefined") {
          anime({
            targets: window,
            scrollTop: targetPosition,
            duration: 800,
            easing: "easeInOutQuad"
          });
        } else {
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
        }
      }
    });
  });
  let currentSection = "";
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 150;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        if (currentSection !== sectionId) {
          currentSection = sectionId;
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${sectionId}`) {
              link.classList.add("active");
            }
          });
        }
      }
    });
  });
}
window.Animations = {
  initParallax,
  initSmoothScroll
};
