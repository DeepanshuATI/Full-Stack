const mongoose=require('mongoose')
async function main() {
    await mongoose.connect(process.env.DB_CONNECT_URL)
    console.log("Database connected successfully");
}

module.exports=main;
