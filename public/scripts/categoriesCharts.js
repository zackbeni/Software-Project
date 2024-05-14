const ctx = document.getElementById('myChart');
const a = document.querySelectorAll('.labels')
const s = document.querySelectorAll('.data')
const labels = []
const span = []
for (let i = 0; i <= a.length-1; i++){
      labels.push(a[i].innerText)
}
for (let i = 0; i <= s.length-1; i++){
  span.push(s[i].innerText)
}
console.log(a)
new Chart(ctx, {
  type: 'bar',
  backgroundColor: 'red',
  data: {
    labels: [...labels],
    datasets: [{
      label: 'Number of Resources under Each Category',
      backgroundColor: 'rgb(52, 112, 209)',
      data: [...span],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});