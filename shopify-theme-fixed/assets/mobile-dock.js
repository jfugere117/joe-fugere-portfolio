if (!window.Eurus.loadedScript.has('mobile-dock.js')) {
  window.Eurus.loadedScript.add('mobile-dock.js');
  
  requestAnimationFrame(() => {
    document.addEventListener("alpine:init", () => {
      Alpine.data('xMobileDock', () => ({
        showDock: false,
        debounce(func, wait) {
          let timeout;
          return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
          };
        },
        initMobileDock() {
          const root = document.documentElement;
          setTimeout(() => {
            const containerMobileDock = document.getElementById("mobile-dock-container");
            const heightMobileDock = containerMobileDock ? containerMobileDock.offsetHeight : 0;

            requestAnimationFrame(() => {
              const value = heightMobileDock + "px";
              root.style.setProperty('--height-mobile-dock', value);
              document.body.style.marginBottom = value;
            })
          }, 0);
          const header = document.getElementById('x-header-container');
          let headerBottom = document.getElementById('x-header-sentinel-bottom');
          const updateDock = () => {
            if (!header) {
              this.showDock = true;
            } else {
              if (headerBottom) {
                this.showDock = (headerBottom.getBoundingClientRect().bottom <= 0);
              } else {
                headerBottom = document.getElementById('x-header-sentinel-bottom');
                this.showDock = true;
              }
            }
          }
          window.addEventListener('scroll', this.debounce(updateDock, 50), { passive: true });

          const search = document.getElementById('FormSearchMobileDock');
          if (search) {
            const announcement = document.getElementById('x-announcement');
            const isSticky = announcement?.getAttribute('data-is-sticky') === 'true';
            const announcementHeight = announcement?.offsetHeight;

            window.requestAnimationFrame(() => {
              if (isSticky) {
                document.documentElement.style.setProperty('--announcement-height', `${announcementHeight}px`);
                search.style.top = 'var(--announcement-height)';
              } else {
                search.style.top = '0';
              }
            })
          }
        }
      }));
    });
  });
}
