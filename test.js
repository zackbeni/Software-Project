

db.resources.findOne({_id: ObjectId('663d6811d3e91886db02df20')})
db.resources.findOne({_id: ObjectId('663d6811d3e91886db02df20')}, {_id: 0})
db.bookmarks.find({resource: ObjectId('663d6811d3e91886db02df20'), bookmarker: ObjectId('6640fae03fc773f1f776c0ee')})


db.users.findOne({_id: ObjectId('6640fae03fc773f1f776c0ee')})
db.bookmarks.findOne({_id: ObjectId('6640fd0aad3057a38b325589')})




// const test = [
//     {
//       _id: '6640fd0aad3057a38b325589',
//       isBookmarked: true,
//       resource: '663d6811d3e91886db02df20',
//       bookmarker: '6640fae03fc773f1f776c0ee',
//       __v: 0
//     }
//   ]
  

//   console.log(test[0].bookmarker)