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
    let rightItem;
    let leftItems;
    let leftItem;
    let updatedArray;
    let touchInitialPosition;
    let currentTranslate = 0;
    let isSwiping = false;

    function carouselInitialSetUp() {
      carouselContainer.classList.add('carousel-container');
      carouselItems.forEach((item) => {
        item.classList.add('carousel-item')
        item.addEventListener('click', () => slideCarousel(item));
        item.addEventListener('touchstart', (e) => swipeStart(e));
        item.addEventListener('touchmove', (e) => swipeMove(e));
        item.addEventListener('touchend', swipeEnd);
      });

      setInitialCarouselItemPosition();

      if (hasArrows) addArrows();
      if (cssMaxWidth) carouselContainer.style.maxWidth = `${cssMaxWidth}px`;
    }

    function addArrows() {
      const leftArrow = {
        'text': '❰',
        'btnTypeClass': 'carousel-btn-previous',
      };
      const rightArrow = {
        'text': '❱',
        'btnTypeClass': 'carousel-btn-next',
      };

      createArrow(leftArrow, translateToLeft);
      createArrow(rightArrow, translateToRight);
    }

    function createArrow(arrow, translateFunction) {
      const carouselArrowButton = document.createElement('button');

      carouselArrowButton.textContent = arrow.text;
      carouselArrowButton.classList.add('carousel-btn', arrow.btnTypeClass);
      carouselContainer.appendChild(carouselArrowButton);

      carouselArrowButton.addEventListener('click', translateFunction);
    }

    function setInitialCarouselItemPosition() {
      sliceCarouselItems(carouselItems);
      setCenterPosition(centralItem);
      setRightItemsPosition(rightItems);
      setLeftItemsPosition(leftItems);
    }

    function sliceCarouselItems(carouselItemsArray) {
      const getRightMostMiddleIndex = carouselItemsArray.length / 2 + 1;

      centralItem = carouselItemsArray[0];
      rightItems = carouselItemsArray.slice(1, getRightMostMiddleIndex);
      leftItems = carouselItemsArray.slice(getRightMostMiddleIndex);

      return centralItem, rightItems, leftItems;
    }

    function setCenterPosition(centralItem) {
      centralItem.classList.add('center');
      centralItem.style.transform = 'translateX(0) scale(1)';
      centralItem.style.zIndex = carouselItems.length;
      centralItem.dataset.carouselItem = 0;
    }

    function setRightItemsPosition(rightItems) {
      if (!Array.isArray(rightItems)) {
        rightItems.style.transform = `translateX(-${50}px) scale(${0.9})`;
        rightItems.dataset.carouselItem = -1;
        rightItems.style.zIndex = 1;
      } else {
        rightItems.forEach((item, index) => {
          if (window.innerWidth <= responsiveBreakpoint) {
            item.style.transform = `translateX(${50}px) scale(${0.9})`;
          } else {
            const translateValue = index + 1;
            item.style.transform = `translateX(${70 * translateValue}px) scale(${1 - translateValue / 15})`;
          }

          item.style.zIndex = rightItems.length - index;
          item.dataset.carouselItem = index + 1;
        });
      }
    }

    function setLeftItemsPosition(leftItems) {
      if (!Array.isArray(leftItems)) {
        leftItems.style.transform = `translateX(${50}px) scale(${0.9})`;
        leftItems.dataset.carouselItem = 1;
        leftItems.style.zIndex = 1;
      } else {
        leftItems.forEach((item, index) => {
          if (window.innerWidth <= responsiveBreakpoint) {
            item.style.transform = `translateX(-${50}px) scale(${0.9})`;
          } else {
            const translateValue = leftItems.length - index;
            item.style.transform = `translateX(-${70 * translateValue}px) scale(${1 - translateValue / 15})`;
          }

          item.style.zIndex = index + 1;
          item.dataset.carouselItem = -(leftItems.length - index);
        });
      }
    }

    function translateToRight() {
      if (carouselItemsLength === 2) {
        centralItem = carouselItems[1];
        rightItem = carouselItems[0];

        setCenterPosition(centralItem);
        setRightItemsPosition(rightItem);

        return;
      }

      updatedArray = [...rightItems, ...leftItems, centralItem];

      updatedArray.forEach((item) => item.classList.remove('center'));
      sliceCarouselItems(updatedArray);
      setRightItemsPosition(rightItems);
      setLeftItemsPosition(leftItems);
      setCenterPosition(centralItem);
    }

    function translateToLeft() {
      if (carouselItemsLength === 2) {
        centralItem = carouselItems[0];
        leftItem = carouselItems[1];
        setCenterPosition(centralItem);
        setLeftItemsPosition(leftItem);

        return;
      }

      updatedArray = [
        leftItems[leftItems.length - 1],
        centralItem,
        ...rightItems
      ];

      if (leftItems.length >= 2)
        updatedArray.push(...leftItems.slice(0, leftItems.length - 1));

      updatedArray.forEach((item) => item.classList.remove('center'));
      sliceCarouselItems(updatedArray);
      setRightItemsPosition(rightItems);
      setLeftItemsPosition(leftItems);
      setCenterPosition(centralItem);
    }

    function slideCarousel(item) {
      const currentClickedElementIndex = +item.dataset.carouselItem;
      const clickedIndexSign = Math.sign(currentClickedElementIndex);
      const absoluteClickedIndexValue = Math.abs(currentClickedElementIndex);
      let index = 0;

      if (currentClickedElementIndex === 0)
        return;
      else if (clickedIndexSign === 1)
        translateToSelectedItem(index, absoluteClickedIndexValue, translateToRight);
      else if (clickedIndexSign === -1)
        translateToSelectedItem(index, absoluteClickedIndexValue, translateToLeft);
    }

    function translateToSelectedItem(index, clickedIndex, translateFunction) {
      if (index === 0) {
        translateFunction();
        index++;
      }

      if (index < clickedIndex) {
        setTimeout(() => {
          translateFunction();
          index++;
          translateToSelectedItem(index, clickedIndex, translateFunction);
        }, 200)
      }
    }

    function swipeStart(e) {
      isSwiping = true;
      touchInitialPosition = e.touches[0].clientX;
    }

    function swipeMove(e) {
      if (isSwiping) {
        const currentPosition = e.touches[0].clientX;
        currentTranslate = currentPosition - touchInitialPosition;
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
