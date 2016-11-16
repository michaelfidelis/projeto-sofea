# Projeto de exemplo para arquitetura SOFEA
## Comandos a executar

### NPM
Link para o site oficial: https://www.npmjs.com/

Certifique -se de que o NPM está instalado na máquina, então execute: 

```
npm init
```

Preencha todas as informações solicitadas e verifique se o arquivo *package.js* foi criado.

### Bower e Bowerrc
Link para o site oficial: https://bower.io/

Instale o bower em sua máquina (se já não estiver instalado):
```
npm install -g bower
```

Inicialize o bower em seu projeto:
```
bower init
```

Preencha as informações solicitadas e verifique que ao final do processo o arquivo **bower.json** foi criado na raíz do projeto.

#### Configurando o proxy para o Bower: 

Crie um arquivo chamado .bowerrc na raíz do projeto, com as seguintes informações: 

```js
{
    "proxy": "http://usuario:senha@host:porta",
    "https-proxy": "https://usuario:senha@host:porta",
}
```

Após configurar o proxy, instale as dependencias necessárias:
```
bower install bootstrap

bower install angular

bower install angular-bootstrap

bower install angular-resource

bower install ui-router

```

### Grunt 
Link para o site oficial: http://gruntjs.com/

Instale o Grunt no projeto: 

```
npm install -g grunt-cli
npm install -g grunt --save-dev

//Instale as dependencias tambem
npm install grunt-contrib-uglify --save-dev
npm install grunt-contrib-cssmin --save-dev
```
Crie um arquivo *Gruntfile.js* na raiz do projeto, com as seguintes informações: 

```js
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            build: {
                //Arquivos *.JS que devem ser minificados
                src: ['app/app.js', 'app/app.config.js', 'app/**/*.js'],
                
                //Destino do arquivo minificado
                dest: 'assets/all.min.js'
            }
        },  
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist.min.css': ['foo.css', 'bar.css']
                }
            }
        }

    });

    // Carregue os componentes utilizados pelas tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');


    // Registre as tasks para que o Grunt execute
    grunt.registerTask('default', [
        'uglify'
        'cssmin']);
};

```