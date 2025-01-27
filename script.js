'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const allButtons = document.getElementsByTagName('button');
const section1 = document.querySelector('#section--1');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Page Navigation
//adding event handleer by foreach
//but this will slow down the application
/*
document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/
//Event delegation
//adding event handler to parent

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tab Opeartion
tabContainer.addEventListener('click', function (tab) {
  const clicked = tab.target.closest('.operations__tab');
  if (!clicked) return;

  //Remove active classes from all
  tabs.forEach(tb => tb.classList.remove('operations__tab--active'));

  tabContent.forEach(con =>
    con.classList.remove('operations__content--active')
  );
  //add the active class to desired tab
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const fading = function (e) {
  //this keyword here refers to the argument passed
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
//passing argumetns into handler
nav.addEventListener('mouseover', fading.bind(0.5));

nav.addEventListener('mouseout', fading.bind(1));

// sticky nav

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  //entries is the threshold we defined. it can be an array as well
  const [entry] = entries; //same as entry=entires[0]

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const oberver = new IntersectionObserver(stickyNav, {
  root: null, //the thing to which the oberver will be intersecting.Here it in null cause we want to get result for the entire window
  threshold: 0, // set this to how much are we want for the function to be triggered. 0 means as soon as it starts or end,  0.1(10%)means when 10% of the area is in view
  rootMargin: `-${navHeight}px`, // margin set at which the intersection should happen. here it is -ive cause we want the margin before
});
oberver.observe(header);

//revealing elements on scroll
const sectionAppear = function (entries, observer) {
  //looping over each entry to ensure it loads even if we are between two section and reload.
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};
const sectionObserver = new IntersectionObserver(sectionAppear, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

const lazyImages = document.querySelectorAll('img[data-src]');

const laodImage = function (entires, oberver) {
  const [enrty] = entires;

  if (!enrty.isIntersecting) return;

  enrty.target.src = enrty.target.dataset.src;

  enrty.target.addEventListener('load', function () {
    enrty.target.classList.remove('lazy-img');
  });
  oberver.unobserve(enrty.target);
};
const imgObserver = new IntersectionObserver(laodImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

lazyImages.forEach(img => imgObserver.observe(img));

//Slider
let currSlide = 0;
const maxSlide = slides.length;

const activateDots = function (slide) {
  const dots = document.querySelectorAll('.dots__dot');
  dots.forEach(s => s.classList.remove('dots__dot--active'));

  console.log(slide);
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
const goToSlide = function (slideCurr) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - slideCurr)}%)`;
  });
};
const createDots = function () {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const prevSlide = function () {
  if (currSlide == 0) currSlide = maxSlide - 1;
  else currSlide--;

  goToSlide(currSlide);
  activateDots(currSlide);
};

const nextSlide = function () {
  if (currSlide == maxSlide - 1) currSlide = 0;
  else currSlide++;

  goToSlide(currSlide);
  activateDots(currSlide);
};

btnLeft.addEventListener('click', prevSlide);

btnRight.addEventListener('click', nextSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

//create dots for slider

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    currSlide = Number(e.target.dataset.slide);
    goToSlide(currSlide);
    activateDots(currSlide);
  }
});

const init = function () {
  createDots();
  goToSlide(0);
  activateDots(0);
};
init();
//Other work
/*
const message = document.createElement('div');
message.classList.add('cookie-message');

message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

header.append(message);

message.style.backgroundColor = '#37383d';
message.style.width = '120%';
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

//document.documentElement.style.setProperty('--color-primary', 'purple');

//clicking on the learn more button and scrolling to section 1

//Events listners
const h1 = document.querySelector('h1');

const h1Alert = function () {
  alert('Great! your hovered over h1');

  h1.removeEventListener('mouseenter', h1Alert);
};
//h1.addEventListener('mouseenter', h1Alert);

//Event Propogation

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  console.log(randomColor());
  this.style.backgroundColor = randomColor();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});
*/
