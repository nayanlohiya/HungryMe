const Menu = require('../../models/menu') //importing menu model from the model folder so as to display menus object in the home page
function homeController() {
    return {
        async index(req, res) {
            const pizzas = await Menu.find() //getting all the objects in the pizzas
            return res.render('home', { pizzas: pizzas }) //redering home page with allthe pizzas object
        }
    }
}

module.exports = homeController
//comp