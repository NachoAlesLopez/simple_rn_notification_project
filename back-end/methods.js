function getNotifications(req, res) {
    console.log("Solicita notificación");
    // TODO Cambiar con algo más realista
    res.status(200).json({ notification: {
        title: "Este es el título de la notificación",
        description: "Esta es la descripción de la notificación",
        actions: '["Esta es la primera acción","Esta es la segunda acción, que tendrá como respuesta un alert()"]'
    }});
}

module.exports = {
    getNotifications
}