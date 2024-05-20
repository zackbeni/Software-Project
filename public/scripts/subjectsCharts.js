//Subjects Charts
const ctx = document.getElementById('myChart1');
const a = document.querySelectorAll('.labels')
const s = document.querySelectorAll('.data')
console.log('hello', a, s)
const labels = []
const span = []
for (let i = 0; i <= a.length-1; i++){
  console.log(a[i].innerText)
      labels.push(a[i].innerText)
}
for (let i = 0; i <= s.length-1; i++){
  span.push(s[i].innerText)
}
console.log(labels)

new Chart(ctx, {
  type: 'bar',
  backgroundColor: 'red',
  data: {
    labels: [...labels],
    datasets: [{
      label: 'Number of Resources under each Subject',
      backgroundColor: 'rgb(48, 200, 235)',
      color: 'rgb(52, 112, 209)',
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