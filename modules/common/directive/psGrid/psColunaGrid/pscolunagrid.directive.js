/**
* @ngdoc overview
* @name psGrid
*
* @description
* Coluna para o Grid dinamico com o padrão visual da Porto Seguro
*
* @param {texto@} subLinha - Sub Coluna
* @param {texto@} colunaSpan - Quantidade de colunas mescladas (ref. colspan)
* @param {texto@} linhaSpan - Quantidade de linhas mescladas (ref. rowspan)
* @param {texto@} titulo - Titulo da coluna
* @param {numero@} width - Largura da coluna
* @param {texto@} id (Obrigatório caso ) - Identificação da coluna
		O campo {id} é opcional caso informe o {titulo} da coluna
		Caso seja necessário duas colunas com o mesmo {titulo} basta informar um {id} diferente para cada uma
		Obrigatoriedade em casos:
		- não haja titulo
		- filtro
		- ordenação
		Obs.: Coluna referente a grupo de colunas deve usar o style="display: none".
*/

(function () {

	'use strict';

	angular.module('projetosofea.common.directive')
		.directive('psColunaGrid', psColunaGrid);

	function psColunaGrid() {
		var colunaGridDirective = {
			restrict: 'EA',
			require: '^psGrid',
			template: '<td ng-init=\"this[$parent.grid.variavel] = $parent.$item; $index = $parent.$index\" ng-transclude></td>',
			transclude: true,
			replace: true,
			link: function (scope, element, attrs, gridController) {

				if ((attrs.titulo === undefined) && attrs.id === undefined) {
					throw Error('[ps-coluna-grid] É preciso informar o titulo (Atributo \'titulo\') ou um Id (Atributo \'id\') para todas as colunas. Exemplo: <ps-coluna-grid titulo=\"Codigo\">Conteúdo...</ps-coluna-grid>');
				}
				gridController.addColuna({
					subLinha: attrs.subLinha,
					colunaSpan: attrs.colunaSpan,
					linhaSpan: attrs.linhaSpan,
					titulo: attrs.titulo,
					width: attrs.width,
					id: attrs.id,
					var: attrs.var,
					multiselect: attrs.multiselect === 'true',
					itensSelecionados: attrs.itensSelecionados,
					tipoFiltro: attrs.tipoFiltro,
					listaFiltro: attrs.listaFiltro
				});
			}
		}
		return colunaGridDirective;
	};
})();
