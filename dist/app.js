// const express = require('express');
// const http = require('http');
// const Vue = require('vue');
// const { createRenderer } = require('vue-server-renderer');
// const cors = require('cors');

// const port = 4000;
// const app = express();
// const server = http.createServer(app);
// const renderer = createRenderer();
// app.use(express.static('public'));
// app.use(express.json());
// app.use(cors());

// app.get('/proxy', async (req, res) => {
//   try {
//     const app = new Vue({
//       template: `
//         <html>
//           <head>
//             <meta property="og:title" content="My OG meta tags">
//             <meta property="og:description" content="Your OG Description">
//             <meta property="og:image" content="https://wallpaperaccess.com/full/2817877.jpg">
//             <meta property="og:url" content="https://update-branch--og-check.netlify.app/#/">
//           </head>
//           <body>
//             <div id="app">
//               The visited URL is: ${ req.url }
//             </div>
//             <script>
//               if (window.location.href === 'http://localhost:4000/proxy') {
//                 window.location.href = 'https://www.linkedin.com/';
//               }
//             </script>
//             <script src="./src/public/app.js"></script>
//             <script>
//               new Vue({
//                 el: '#app',
//                 data: {
//                   url: '${req.url}'
//                 }
//               });
//             </script>
//           </body>
//         </html>
//       `
//     });

//     renderer.renderToString(app, (err, html) => {
//       if (err) {
//         console.error(err);
//         res.status(500).end('Server Error');
//       } else {
//         res.send(html);
//       }
//     });
//   } catch (e) {
//     console.log(e);
//   }
// });

// server.listen(port, () => {
//   console.log('Server is running on port', port);
// });



const Vue = require('vue');
const server = require('express')();
const fs = require('fs');
const template = fs.readFileSync('./public/index.template.html', 'utf-8');
const cors = require('cors');
server.use(cors());
const renderer = require('vue-server-renderer').createRenderer({
  template,
});

const context = {
  title: 'vue ssr',
  meta: `
    <meta property="og:title" content="My OG meta tags">
    <meta property="og:description" content="Your OG Description">
    <meta property="og:image" content="https://wallpaperaccess.com/full/2817877.jpg">
    <meta property="og:url" content="https://update-branch--og-check.netlify.app/#/">
  `,
  renderToString: '', // Placeholder for rendered content
};

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<div>The visited URL is: {{ url }}</div>`,
  });

  renderer.renderToString(app, context, (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).end('Internal Server Error');
    } else {
      context.renderToString = html; // Assign the rendered content
      console.log(html);
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Bypass-Tunnel-Reminder','asg')
      res.end(html);
    }
  });
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
