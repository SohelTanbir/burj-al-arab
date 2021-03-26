const express = require('express');
const bodyParser = require('body-parser')
const dbUserName = 'sohelrana'
const dbPassword = 'fF4W4Zq572zg6dgR';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId

const uri = "mongodb+srv://sohelrana:fF4W4Zq572zg6dgR@cluster0.kjddt.mongodb.net/OrganicDababase?retryWrites=true&w=majority";


const app =  express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("OrganicDababase").collection("products");
  
  app.get('/products', (req, res)=>{
      collection.find({}).toArray((err, documents)=>{
        res.send(documents)
      })
  })
  
// load product from database
app.get('/product/:id', (req, res)=>{
  collection.find({_id: ObjectId(req.params.id)})
  .toArray((err, documents)=>{
    res.send(documents[0])
  })
})


// update data in database
app.patch('/update/:id', (req, res) =>{
  collection.updateOne({_id: ObjectId(req.params.id)},
  {
    $set:{price:req.body.price,quantity:req.body.quantity, name:req.body.name}
  })
    .then(result =>{
     res.send(result.modifiedCount > 0)
    })
})

// insert product 
  app.post('/addProduct', (req, res)=>{
    const product = req.body
    collection.insertOne(product)
    .then(result =>{
        res.redirect('/')
    })
  })

// delete item from database
app.delete('/delete/:id', (req, res)=>{
  collection.deleteOne({_id: ObjectId(req.params.id)})
  .then(result =>{
    res.send(result.deletedCount > 0)
  })
  
})


});







app.listen(3000)