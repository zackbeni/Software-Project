const ctx2 = document.getElementById('myChart2');
const a2 = document.querySelectorAll('.labels')
const s2 = document.querySelectorAll('.data')
const labels2 = []
const span2 = []
for (let i = 0; i <= a2.length-1; i++){
      labels2.push(a2[i].innerText)
}
for (let i = 0; i <= s2.length-1; i++){
  span2.push(s2[i].innerText)
}
console.log(a2)
new Chart(ctx2, {
  type: 'bar',
  backgroundColor: 'red',
  data: {
    labels: [...labels],
    datasets: [{
      label: 'Number of Resources under Each Category',
      backgroundColor: 'rgb(48, 200, 235)',
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