require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('605c10e7e5bb0c3c64c3a79f').then(() => {
//     return Task.countDocuments({completed: false})
// }).then((c) => {
//     console.log("No. of tasks to be completed: " + c);
// }).catch((e) => {
//     console.log(e);
// })

const CountAfterRemove = async (id) => {
    const t1 = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed: false});
    return count
}

console.log(CountAfterRemove('605c10f3ca67e340ecf11f6e').then((count) => {
    console.log(count);
}))