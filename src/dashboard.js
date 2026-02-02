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
  makeData: function () {
    this.labelsCategories = [];
    this.datasCategories = [];
    if (this.data && this.data.categories) {
       for (let i = 0, len = this.data.categories.length; i < len; i++) {
        this.labelsCategories.push(this.data.categories[i].link_rewrite);
        this.datasCategories.push(this.data.categories[i].read_count);
      }
    }
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

    this.data = data;
    this.makeData();
    
    if (this.labelsCategories.length > 0) {
        this.createChart(
          options.topCategoriesId,
          this.labelsCategories,
          this.datasCategories,
          this.bgColors,
          this.borderColors,
        );
    }
    
    // Assuming labelsContent/datasContent might be populated elsewhere or needs similar logic to makeData
    // For now keeping existing logic for topContents
    if (this.labelsContent.length > 0) {
        this.createChart(
          options.topContentsId,
          this.labelsContent,
          this.datasContent,
          [...this.bgColors].reverse(),
          [...this.borderColors].reverse(),
        );
    }
  },
};
