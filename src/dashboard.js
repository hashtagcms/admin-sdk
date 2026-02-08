export const Dashboard = {
  data: [],
  labelsCategories: [],
  datasCategories: [],
  labelsContent: [],
  datasContent: [],
  bgColors: [
    "rgba(93, 128, 96, 0.7)",
    "rgba(135, 188, 118, 0.7)",
    "rgba(146, 222, 184, 0.7)",
    "rgba(135, 131, 222, 0.7)",
    "rgba(128, 57, 5, 0.7)",
    "rgba(231, 191, 200, 0.7)",
    "rgba(255, 99, 132, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(255, 159, 64, 0.7)",
  ],
  borderColors: [
    "rgba(82, 117, 85, 1)",
    "rgba(115, 172, 96, 1)",
    "rgba(113, 204, 158, 1)",
    "rgba(103, 99, 206, 1)",
    "rgba(112, 51, 7, 1)",
    "rgba(213, 158, 170, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ],
  createChart: function (id, labels, datas, bgColors, boderColors) {
    if (typeof document === 'undefined') return;
    
    let ctx = document.getElementById(id);
    if (!ctx) {
      console.warn(`Chart canvas with id '${id}' not found.`);
      return;
    }
    
    // Check if Chart is defined (assumed global from Chart.js script)
    if (typeof Chart === 'undefined') {
      console.error('Chart.js is not loaded.');
      return;
    }

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "# of Reads",
            data: datas,
            backgroundColor: bgColors,
            borderColor: boderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  },
  makeChartData: function (items) {
    let labels = [];
    let datas = [];
    if (items && Array.isArray(items)) {
       for (let i = 0, len = items.length; i < len; i++) {
        let label = items[i].link_rewrite;
        if (label === '/' || label === '' || label === null) {
            label = 'Home (/)';
        }
        labels.push(label);
        datas.push(items[i].read_count);
      }
    }
    return { labels, datas };
  },
  /**
   * Initialize Dashboard Charts
   * @param {Object} data - The data object containing categories/content 
   * @param {Object} config - Configuration for chart IDs { topCategoriesId: 'topCatgories', topContentsId: 'topContents' }
   */
  init: function (data, config = {}) {
    const defaults = {
        topCategoriesId: 'topCatgories',
        topContentsId: 'topContents'
    };
    const options = { ...defaults, ...config };

    if (!data) return;

    // 1. Process Categories
    const categories = this.makeChartData(data.categories);
    if (categories.labels.length > 0) {
        this.createChart(
          options.topCategoriesId,
          categories.labels,
          categories.datas,
          this.bgColors,
          this.borderColors,
        );
    }
    
    // 2. Process Pages
    const pages = this.makeChartData(data.pages);
    if (pages.labels.length > 0) {
        this.createChart(
          options.topContentsId,
          pages.labels,
          pages.datas,
          [...this.bgColors].reverse(),
          [...this.borderColors].reverse(),
        );
    }
  },
};
