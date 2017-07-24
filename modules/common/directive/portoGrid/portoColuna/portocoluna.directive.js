(function () {
    'use strict';

    angular.module('projetosofea.common.directive')
        .directive('portoColuna', PortoColunaDirective);

    PortoColunaDirective.$inject = [];

    function PortoColunaDirective() {
        return {
            restrict: 'E',
            require: '^portoGrid',
            link: PortoColunaLink,
            scope: false
        }

        PortoColunaLink.$inject = ['scope', 'element', 'attrs', 'gridController'];
        function PortoColunaLink(scope, element, attrs, gridController){

            if(!attrs.titulo) {
                throw new SyntaxError('Titulo da coluna é obrigatório! <porto-coluna titulo=\'xxx\'>');
            }
            gridController.adicionarColuna(element[0]);
        }
    }
})();
