<script>
export default {
  mockTableData() {
    let data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        Age: "Business" + Math.floor(Math.random() * 100 + 1),
        Province: Math.floor(Math.random() * 3 + 1),
        City: ["City", "People", "Cost", "Life", "Entertainment"],
        Address: [
          {
            n: "People" + Math.floor(Math.random() * 100 + 1),
            c: Math.floor(Math.random() * 1000000 + 100000)
          },
          {
            n: "People" + Math.floor(Math.random() * 100 + 1),
            c: Math.floor(Math.random() * 1000000 + 100000)
          },
          {
            n: "People" + Math.floor(Math.random() * 100 + 1),
            c: Math.floor(Math.random() * 1000000 + 100000)
          }
        ],
        Postcode: Math.floor(Math.random() * 1000000 + 1)
      });
    }
    return data;
  },
  changePage() {
    this.data4 = this.mockTableData();
  }
};
</script>
