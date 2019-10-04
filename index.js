/*
play this: https://www.youtube.com/watch?v=d-diB65scQU

Sing along:

here's a little code I wrote, you might want to read it really slow, don't worry be happy
in every line there may be trouble, but if you worry you make it double, don't worry, be happy
ain't got no sense of what is REST? just concentrate on learning Express, don't worry, be happy
your file is getting way too big, bring a Router and make it thin, don't worry, be crafty
there is no data on that route, just write some code, you'll sort it out… don't worry, just API…
I need this code, just don't know where, perhaps should make some middleware, don't worry, be happy

Go code!
*/

const express = require('express');
const server = express();
const projectModel = require('./data/helpers/projectModel')
const actionModel = require('./data/helpers/actionModel')

server.use(express.json());

// Test
server.get('/', (req, res) => {

})

// Projects
server.get('/projects', (req, res) => {
    projectModel
    .get()
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        res.status(500).json({ error: "The users information could not be retrieved." })
    })
})

server.get('/projects/:id', validateUserId, (req, res) => {
        res.status(200).json(req.project)
})

server.get('/projects/:id/actions', validateUserId,(req, res) => {
    const id = req.params.id

    projectModel
    .getProjectActions(id)
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        res.status(500).json({ error: "The users information could not be retrieved." })
    })
})

server.get('/projects/:id/actions/:action_id', validateUserId,(req, res) => {
    const action_id = req.params.action_id

    actionModel
    .get(action_id)
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        res.status(500).json({ error: "The users information could not be retrieved." })
    })
})

server.post('/projects', (req, res) => {
    const Data = req.body;

    (!Data.name || !Data.description) ? res.status(400).json({ errorMessage: "Please provide name and description for the comment." })
    :projectModel
        .insert(Data)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        });
});

server.post('/projects/:id/actions', validateUserId,(req, res) => {
    req.body.project_id = parseInt(req.params.id)
    const Data = req.body;
    // console.log(Data)

    (!Data.project_id || !Data.description || !Data.notes) ? res.status(400).json({ errorMessage: "Please provide name and description for the comment." })
    :actionModel
        .insert(Data)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        });
});

server.delete('/projects/:id', validateUserId, (req, res) => {
    const id = req.params.id

    projectModel
    .remove(id)
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        res.status(500).json({ error: "There was an error while deleting the post from the database" })
    })
})

server.delete('/projects/:id/actions/:action_id', validateUserId, (req, res) => {
    const action_id = req.params.action_id

    actionModel
    .remove(action_id)
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        res.status(500).json({ error: "There was an error while deleting the post from the database" })
    })
})

server.put('/projects/:id', validateUserId, (req, res) => {
    const id = req.params.id
    const Data = req.body;

    projectModel
    .update(id, Data)
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        res.status(500).json({ error: "There was an error while deleting the post from the database" })
    })
})

server.put('/projects/:id/actions/:action_id', validateUserId, (req, res) => {
    const action_id = req.params.action_id
    const Data = req.body;

    actionModel
    .update(action_id, Data)
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        res.status(500).json({ error: "There was an error while deleting the post from the database" })
    })
})


function validateUserId(req, res, next) {
    const id = req.params.id
    
    projectModel
    .get(id)
    .then(user => {
        user ? req.project = user
        : ''

        !user ? res.status(404).json({ message: "invalid user id"})
        : next()
    })
    .catch(error => res.status(500).json({ error: "Error getting users"}))
};


const port = 5000;

server.listen(port, () => console.log(`\n** API on port ${port} **\n`));