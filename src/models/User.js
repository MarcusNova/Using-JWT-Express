const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new Schema({
    username: String,
    email: String,
    password: String
});
userSchema.methods.encryptPassword = async (password) => {
    //Aplicamos un hash para hacerse seguro
    const salt = await bcrypt.genSalt(10); 
    return bcrypt.hash(password, salt);   
};
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
}
//Hacemos que el modelo guarde en la db utilizando el esquema que 
//hicimos arriba
module.exports = model('User', userSchema);