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

    function carouselInitialSetUp() {
      carouselContainer.classList.add('carousel-container');
      carouselItems.forEach((item, index) => {
        item.classList.add('carousel-item');
        item.dataset.carouselItem = index;
      });

      if (hasArrows) showArrows();
      if (cssMaxWidth) carouselContainer.style.maxWidth = `${cssMaxWidth}px`;

      carouselItems.forEach(item => {
        item.addEventListener('click', () => slideCarousel(item))
      })

      setInitialCarouselItemPosition();
    }

    function showArrows() {
      const btnPrevious = document.createElement('button');
      btnPrevious.textContent = '❰';
      btnPrevious.classList.add('carousel-btn', 'carousel-btn-previous');

      const btnNext = document.createElement('button');
      btnNext.textContent = '❱';
      btnNext.classList.add('carousel-btn', 'carousel-btn-next');

      carouselContainer.appendChild(btnPrevious)
      carouselContainer.appendChild(btnNext)

      btnPrevious.addEventListener('click', translateToLeft)
      btnNext.addEventListener('click', translateToRight)
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
      centralItem.classList.add('center')
      centralItem.style.transform = 'translate3d(0, 0, 0)';
      centralItem.style.zIndex = carouselItems.length - 1;
    }

    function setRightItemsPosition(rightItems) {
      rightItems.forEach((item, index) => {
        if (window.innerWidth <= responsiveBreakpoint) {
          item.style.transform = 'translate3d(50px, 0, -80px)';
        } else {
          const translateValue = index + 1;
          item.style.transform = `translate3d(${50 * translateValue}px, 0, -${50 * translateValue}px)`;
        }

        item.style.zIndex = rightItems.length - index;
      })
    }

    function setLeftItemsPosition(leftItems) {
      leftItems.forEach((item, index) => {
        if (carouselItemsLength === 2) {
          item.style.transform = 'translate3d(50px, 0, -80px)';
        } else if (window.innerWidth <= responsiveBreakpoint)
          item.style.transform = 'translate3d(-50px, 0, -80px)';
        else {
          const translateValue = leftItems.length - index;
          item.style.transform = `translate3d(-${50 * translateValue}px, 0, -${50 * translateValue}px)`;
        }


        item.style.zIndex = index + 1;
      })
    }

    function translateToRight() {
      if (carouselItemsLength === 2) {
        centralItem = carouselItems[1]
        rightItem = carouselItems[0]
        setCenterPosition(centralItem);
        rightItem.style.transform = 'translate3d(-50px, 0, -80px)';

        return;
      }

      updatedArray = [...rightItems, ...leftItems, centralItem]
      const getRightMostMiddleIndex = updatedArray.length / 2 + 1;

      centralItem = updatedArray[0];
      rightItems = updatedArray.slice(1, getRightMostMiddleIndex);
      leftItems = updatedArray.slice(getRightMostMiddleIndex);

      updatedArray.forEach(item => item.classList.remove('center'))
      setCenterPosition(centralItem);
      setRightItemsPosition(rightItems);
      setLeftItemsPosition(leftItems);
    }

    function translateToLeft() {
      if (carouselItemsLength === 2) {
        centralItem = carouselItems[0]
        leftItem = carouselItems[1]
        setCenterPosition(centralItem);
        leftItem.style.transform = 'translate3d(50px, 0, -80px)';

        return;
      }

      let updatedArray;

      if (leftItems.length > 2) {
        updatedArray = [
          leftItems[leftItems.length - 1],
          centralItem,
          ...rightItems,
          ...leftItems.slice(0, 2)
        ]
      } else {
        updatedArray = [
          leftItems[leftItems.length - 1],
          centralItem,
          ...rightItems,
        ]
      }
      const getRightMostMiddleIndex = updatedArray.length / 2 + 1;

      centralItem = updatedArray[0];
      rightItems = updatedArray.slice(1, getRightMostMiddleIndex);
      leftItems = updatedArray.slice(getRightMostMiddleIndex);

      updatedArray.forEach(item => item.classList.remove('center'))
      setRightItemsPosition(rightItems);
      setLeftItemsPosition(leftItems);
      setCenterPosition(centralItem);
    }

    window.addEventListener('resize', () => {
      setRightItemsPosition(rightItems);
      setLeftItemsPosition(leftItems);
    })

    carouselInitialSetUp();
  }

}