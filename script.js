function Carousel(options) {
  const carouselContainer = document.querySelector(`.${options.carouselContainerClass}`);
  const hasArrows = options.arrows;
  const responsiveBreakpoint = options.responsive.breakpoint;
  const cssMaxWidth = options.css.maxWidth;

  const carouselItems = Array.from(carouselContainer.children);
  const carouselItemsLength = carouselItems.length;

  if (carouselItemsLength > 1) {
    let centralItem;
    let rightItems;
    let leftItems;
    let updatedArray;
    let isSwiping = false;
    let startPos;
    let currentTranslate = 0;

    function carouselInitialSetUp() {
      carouselContainer.classList.add('carousel-container');
      carouselItems.forEach((item) => {
        item.classList.add('carousel-item');
      });

      if (hasArrows) showArrows();
      if (cssMaxWidth) carouselContainer.style.maxWidth = `${cssMaxWidth}px`;

      carouselItems.forEach((item) => {
        item.addEventListener('click', () => {
          slideCarousel(item)
        });
        item.addEventListener('touchstart', (e) => swipeStart(e));
        item.addEventListener('touchmove', (e) => swipeMove(e));
        item.addEventListener('touchend', swipeEnd);
      });

      setInitialCarouselItemPosition();
    }

    function showArrows() {
      const btnPrevious = document.createElement('button');
      btnPrevious.textContent = '❰';
      btnPrevious.classList.add('carousel-btn', 'carousel-btn-previous');

      const btnNext = document.createElement('button');
      btnNext.textContent = '❱';
      btnNext.classList.add('carousel-btn', 'carousel-btn-next');

      carouselContainer.appendChild(btnPrevious);
      carouselContainer.appendChild(btnNext);

      btnPrevious.addEventListener('click', translateToLeft);
      btnNext.addEventListener('click', translateToRight);
    }

    function setInitialCarouselItemPosition() {
      const getRightMostMiddleIndex = carouselItems.length / 2 + 1;
      centralItem = carouselItems[0];
      rightItems = carouselItems.slice(1, getRightMostMiddleIndex);
      leftItems = carouselItems.slice(getRightMostMiddleIndex);

      setCenterPosition(centralItem);
      setRightItemsPosition(rightItems);
      setLeftItemsPosition(leftItems);
    }

    function setCenterPosition(centralItem) {
      centralItem.classList.add('center');
      centralItem.style.transform = 'translateX(0) scale(1)';
      centralItem.style.zIndex = carouselItems.length;
      centralItem.dataset.carouselItem = 0;
    }

    function setRightItemsPosition(rightItems) {
      rightItems.forEach((item, index) => {
        if (window.innerWidth <= responsiveBreakpoint) {
          item.style.transform = `translateX(${50}px) scale(${0.9})`;
          item.style.zIndex = rightItems.length - index;
        } else {
          const translateValue = index + 1;
          item.style.transform = `translateX(${70 * translateValue}px) scale(${1 - translateValue / 15})`;
          item.style.zIndex = rightItems.length - index;
        }

        item.dataset.carouselItem = index + 1;
      });
    }

    function setLeftItemsPosition(leftItems) {
      leftItems.forEach((item, index) => {
        if (carouselItemsLength === 2) {
          const translateValue = leftItems.length - index;
          item.style.transform = `translateX(-${50}px) scale(${0.9})`;
          item.style.zIndex = carouselItems.length;

        } else if (window.innerWidth <= responsiveBreakpoint) {
          item.style.transform = `translateX(-${50}px) scale(${0.9})`;
          item.style.zIndex = index + 1;
        } else {
          const translateValue = leftItems.length - index;
          item.style.transform = `translateX(-${70 * translateValue}px) scale(${1 - translateValue / 15})`;
          item.style.zIndex = index + 1;
        }

        item.dataset.carouselItem = -(leftItems.length - index);
      });
    }

    function translateToRight() {
      if (carouselItemsLength === 2) {
        centralItem = carouselItems[1];
        rightItem = carouselItems[0];
        setCenterPosition(centralItem);
        rightItem.style.transform = 'translateX(-50px) scale(0.9)';
        rightItem.dataset.carouselItem = -1;
        rightItem.style.zIndex = 1;

        return;
      }

      updatedArray = [...rightItems, ...leftItems, centralItem];
      const getRightMostMiddleIndex = updatedArray.length / 2 + 1;

      centralItem = updatedArray[0];
      rightItems = updatedArray.slice(1, getRightMostMiddleIndex);
      leftItems = updatedArray.slice(getRightMostMiddleIndex);

      updatedArray.forEach((item) => item.classList.remove('center'));
      setRightItemsPosition(rightItems);
      setLeftItemsPosition(leftItems);
      setCenterPosition(centralItem);
    }

    function translateToLeft() {
      if (carouselItemsLength === 2) {
        centralItem = carouselItems[0];
        leftItem = carouselItems[1];
        setCenterPosition(centralItem);
        leftItem.style.transform = 'translateX(50px) scale(0.9)';
        leftItem.dataset.carouselItem = 1;
        leftItem.style.zIndex = 1;

        return;
      }

      if (leftItems.length >= 2) {
        updatedArray = [
          leftItems[leftItems.length - 1],
          centralItem,
          ...rightItems,
          ...leftItems.slice(0, leftItems.length - 1),
        ];
      } else {
        updatedArray = [leftItems[leftItems.length - 1], centralItem, ...rightItems,];
      }
      const getRightMostMiddleIndex = updatedArray.length / 2 + 1;

      centralItem = updatedArray[0];
      rightItems = updatedArray.slice(1, getRightMostMiddleIndex);
      leftItems = updatedArray.slice(getRightMostMiddleIndex);

      updatedArray.forEach((item) => item.classList.remove('center'));
      setRightItemsPosition(rightItems);
      setLeftItemsPosition(leftItems);
      setCenterPosition(centralItem);
    }

    function slideCarousel(item) {
      const currentClickedElementIndex = +item.dataset.carouselItem;

      if (currentClickedElementIndex === 0) return;
      else if (Math.sign(currentClickedElementIndex) === 1) {
        let index = 0;
        translateToSelectedItem(index, Math.abs(currentClickedElementIndex), translateToRight)
      } else if (Math.sign(currentClickedElementIndex) === -1) {
        let index = 0;
        translateToSelectedItem(index, Math.abs(currentClickedElementIndex), translateToLeft)
      }
    }

    function translateToSelectedItem(index, maxCount, func) {
      if (index === 0) {
        func()
        index++;
      }

      if (index < maxCount) {
        setTimeout(function () {
          func()
          index++;
          translateToSelectedItem(index, maxCount, func);
        }, 300)
      }
    }

    function swipeStart(e) {
      isSwiping = true;
      startPos = e.touches[0].clientX;
    }

    function swipeMove(e) {
      if (isSwiping) {
        const currentPosition = e.touches[0].clientX;
        currentTranslate = currentPosition - startPos;
      }
    }

    function swipeEnd() {
      isSwiping = false;

      if (currentTranslate < -1) translateToRight();
      else if (currentTranslate > 1) translateToLeft();

      currentTranslate = 0;
    }

    window.addEventListener('resize', () => {
      setRightItemsPosition(rightItems);
      setLeftItemsPosition(leftItems);
    });

    carouselInitialSetUp();
  }
}
