/**
 * Cascading (Masonry) grid layout
 * 
 * @requires https://github.com/desandro/imagesloaded
 * @requires https://github.com/Vestride/Shuffle
*/

const masonryGrid = (() => {

  let grid = document.querySelectorAll('.masonry-grid'),
  masonry;

  if (grid === null) return;

    for (let i = 0; i < grid.length; i++) {
    masonry = new Shuffle(grid[i], {
      itemSelector: '.masonry-grid-item',
      sizer: '.masonry-grid-item'
    });

    imagesLoaded(grid[i]).on('progress', () => {
      masonry.layout();
    });

    // Filtering
    let filtersWrap = grid[i].closest('.masonry-filterable');
    if (filtersWrap === null) return;
    let filters = filtersWrap.querySelectorAll('.masonry-filters [data-group]');

    for (let n = 0; n < filters.length; n++) {
      filters[n].addEventListener('click', function(e) {
        let current = filtersWrap.querySelector('.masonry-filters .active'),
            target = this.dataset.group;
        if(current !== null) {
          current.classList.remove('active');
        }
        this.classList.add('active');
        masonry.filter(target);
        e.preventDefault();
      });
    }
  }

})();

export default masonryGrid;
