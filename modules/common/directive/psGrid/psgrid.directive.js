/**
 * @ngdoc overview
 * @name psGrid
 * @example
 * <ps-grid data="controller.listaDeRegistros" variavel="registro">
 *		<ps-grid-coluna titulo="Codigo" width="20%">...</ps-grid-coluna>
 *		<ps-grid-coluna titulo="Descricão"  width="70%">...</ps-grid-coluna>
 *		<ps-grid-coluna id="tituloVazio"  width="10%">...</ps-grid-coluna>
 * <ps-grid>
 *
 * @description
 * Grid dinamico com o padrão visual da Porto Seguro
 *
 * @param {lista=} data (Obrigatório) - A Lista de objetos que será utilizada no grid
 * @param {texto@} variavel (Opcional) - Identificacao do item da lista.
 *		Caso não seja informado o padrão é $item
 * @param {objeto=} itemSelecionado (Opcional) - Item selecionado ao clicar na lista
 * @param {funcao&} acaoPaginacao (Opcional) - Funçao executada ao alterar a página do grid
 *		Deve ser utilizada para grids sob demanda.
 *		é obrigatorio informar o parametro {totalRegistros} caso utilize {acaoPaginacao}
 *		O tamanho da página {tamanhoPagina} deve ser controlado manualmente no caso do grid sob demanda
 * @param {numero=} pagina (Opcional) - Numero da página indicada na paginação
 * @param {numero=} totalRegistros (Condicionado) - Total de registros para determinada consulta.
 *		É obrigatorio no caso do grid sob demanda.
 *		Se o grid não for sob demanda o valor padrão é o tamanho da lista informada no parametro {data}
 * @param {numero=} tamanhoPagina (Opcional) - Define a quantidade de registros por pagina no caso do grid em memoria.
 * 		Não é utilizado no grid sob demanda.
 * @param {booleano=} mostrarPaginacao (Opcional) - Controla se a paginação deve ser exibida.
 *		No caso do grid em memoria são exibidos todos os registros se mostrarPaginacao == false
 * @param {fucao&} acaoSelecionar (Opcional) - Função executada ao selecionar um item do grid
 * @param {booleano=} filtrar (Opcional) - Controla se grid vai ter filtro ou não
 * @param {objeto=} filtros (Opcional) - Objeto onde é gravado os filtros realizados.
 * 		É apenas utilizado em grid sob demanda
 * @param {funcao&} acaoFiltro (Opcional) - Realiza uma função de filtro fora da diretiva.
 *		É apenas utilizado em grid sob demanda
 */

(function () {

	'use strict';

	angular.module('projetosofea.common.directive')
		.directive("psGrid", psGrid)
		.filter('paginateArray', paginateArray);

	function psGrid() {
		var gridDirective = {
			templateUrl: "modules/common/directive/psGrid/psgrid.template.html",
			transclude: true,
			replace: true,
			restrict: 'EA',
			bindToController: true,
			controller: GridController,
			controllerAs: 'grid',
			scope: {
				data: '=',
				variavel: '@?',
				itemSelecionado: '=?',
				acaoPaginacao: '&?',
				acaoSelecionar: '&?',
				pagina: '=?',
				totalRegistros: '=?',
				tamanhoPagina: '=?',
				mostrarPaginacao: '=?',
				filtrar: "=?",
				filtros: "=?",
				acaoFiltro: "&?",
				reversa: "=?",
				colunaOrdenacao: "@?",
				acaoDoubleClick: "&?"
			}
		}
		return gridDirective;

		GridController.$inject = ['$scope', '$filter', '$parse'];

		function GridController($scope, $filter, $parse) {
			var self = this;
			self.colunas = [];
			self.subColunas = [];
			self.variavel = self.variavel || '$item';
			self.pagina = self.pagina || 1;
			self.mostrarPaginacao = self.mostrarPaginacao === undefined || self.mostrarPaginacao;
			self.tamanhoPagina = self.tamanhoPagina || 5;
			self.totalRegistros = self.totalRegistros || 0;
			self.registrosPaginados = [];
			self.listFiltrada = [];

			self.addColuna = addColuna;
			self.selecionarItem = selecionarItem;
			self.doubleClick = doubleClick;
			self.isSelecionado = isSelecionado;
			self.selecionarTodos = selecionarTodos;
			self.gridMultiselect = false;
			self.colunaCheckbox = {};
			self.todosSelecionados = false;

			self.colunasFiltro = [];
			self.digitarFiltro = digitarFiltro;
			self.selecionarFiltro = selecionarFiltro;
			self.filtrado = false;
			self.filtrosAtivos = [];
			self.aplicarFiltro = aplicarFiltro;
			self.colunaOrder = self.colunaOrdenacao || "";
			self.reversa = self.reversa || false;
			self.sortBy = sortBy;

			self.listQtdItensPagina = [5, 10, 25, 50, 100];
			self.qtdItensPagina = self.tamanhoPagina;
			self.atualizarQtdItensPagina = atualizarQtdItensPagina;

			function atualizarQtdItensPagina() {
				self.tamanhoPagina = self.qtdItensPagina;
				_acaoGrid();
			}

			function doubleClick() {
				if (angular.isDefined(self.acaoDoubleClick)) {
					self.acaoDoubleClick();
				}
			}

			function sortBy(coluna) {
				if (coluna) {
					var column = coluna.var;
					if (!column) {
						column = coluna.id;
					}
					if (column) {
						self.reversa = self.colunaOrder === column ? !self.reversa : false;
						self.colunaOrder = column;
					}
				}
				if (self.listFiltrada && self.listFiltrada.length > 0) {
					self.listFiltrada = $filter('orderBy')(self.listFiltrada, self.colunaOrder, self.reversa);
				}
			}

			function filtrarObjeto(filtro, coluna) {
				var nomeVar = coluna.var;
				if (!nomeVar) {
					nomeVar = coluna.id;
				}
				var split = nomeVar.split(".");
				if (split && split.length > 1) {
					filtro[split[0]] = new Object();
					filtro[split[0]][split[1]] = coluna.valorFiltro + "";
				}
				return filtro;
			}

			function getFiltro() {
				var filtro = new Object();
				self.colunasFiltro.forEach(function (coluna) {
					if (coluna.valorFiltro) {
						var nomeVar = coluna.var;
						if (!nomeVar) {
							nomeVar = coluna.id;
						}
						if (nomeVar.match(/\./)) {
							filtro = filtrarObjeto(filtro, coluna);
						} else if (coluna.tipoFiltro === "text") {
							filtro[nomeVar] = coluna.valorFiltro + "";
						} else {
							filtro[nomeVar] = {
								codigo: coluna.valorFiltro + ""
							};
						}
					}
				});
				return filtro;
			}

			function aplicarFiltro() {
				if (!self.filtrado) {
					if (self.gridMemoria) {
						aplicarFiltroMemoria();
					} else {
						// quando é filtro back-end
						self.filtros = getFiltro();
						self.acaoFiltro();
					}
				}
			}

			function aplicarFiltroMemoria() {
				self.filtrado = true;
				self.listFiltrada = angular.copy(self.data);
				var filtro = getFiltro();
				self.listFiltrada = $filter('filter')(self.listFiltrada, filtro);
				sortBy();
				self.registrosPaginados = $filter('paginateArray')(self.listFiltrada, ((self.pagina - 1) * self.tamanhoPagina), (((self.pagina - 1) * self.tamanhoPagina) + self.tamanhoPagina));
				// Total de registros é a quantidade de registros filtrados (utilizado para calculo de paginas de dados filtrados)
				self.totalRegistros = self.listFiltrada.length;
				self.totalPaginas = Math.ceil(self.totalRegistros / self.tamanhoPagina);
			}

			function digitarFiltro(keyEvent) {
				if (keyEvent.which === 13) {
					aplicarFiltro();
				} else {
					self.filtrado = false;
				}
			}

			function selecionarFiltro() {
				self.filtrado = false;
				aplicarFiltro();
			}

			//Implementacoes
			function addColuna(coluna) {
				var colunaExistente = self.colunas.some(function (element) {
					return element.titulo === coluna.titulo && element.id === coluna.id;
				});
				var subColunaExistente = self.subColunas.some(function (element) {
					return element.titulo === coluna.titulo && element.id === coluna.id;
				});

				if (!colunaExistente && !subColunaExistente) {
					if (!self.gridMultiselect && coluna.multiselect) {
						self.gridMultiselect = true;
						self.colunaCheckbox = coluna;
						$scope.$on("gridLimparCheckbox", function () {
							self.todosSelecionados = false;
						});
					}
					if (self.filtrar) {
						var contColuna = self.colunasFiltro.length;
						coluna.numeroColuna = contColuna;
						if (coluna.listaFiltro) {
							coluna.listaFiltro = obterListaSelect(coluna.listaFiltro);
						}
						self.colunasFiltro.push(coluna);
					}

					if (coluna.subLinha) {
						self.subColunas.push(coluna);
					} else {
						self.colunas.push(coluna);
					}
				}
			}

			function selecionarTodos(listaDeSelecionados) {
				var parseSelecionados = $parse(listaDeSelecionados);
				var getterSelecionados = parseSelecionados($scope.$parent);

				if (self.todosSelecionados) {
					parseSelecionados.assign($scope.$parent, []);
					self.todosSelecionados = false;
				} else {
					self.registrosPaginados.forEach(function (item) {
						getterSelecionados.push(item);
					})
					self.todosSelecionados = true;
				}

			}

			function obterListaSelect(listaDeSelecionados) {
				var parseSelecionados = $parse(listaDeSelecionados);
				return parseSelecionados($scope.$parent);
			}


			function selecionarItem(item) {
				self.itemSelecionado = angular.copy(item);
			}

			function isSelecionado(item) {
				return angular.equals(item, self.itemSelecionado);
			}

			function _getData() {
				if (self.acaoPaginacao || self.mostrarPaginacao === false) {
					return self.data;
				} else {
					return $filter('paginateArray')(self.data, ((self.pagina - 1) * self.tamanhoPagina), (((self.pagina - 1) * self.tamanhoPagina) + self.tamanhoPagina));
				}
			}

			function _verificacoes() {
				if (self.acaoPaginacao) {
					if (!self.totalRegistros) {
						throw new Error('É preciso informar o total de registros (\'total-registros\') para o Grid sob demanda.');
					} else if (self.tamanhoPagina) {
						throw new Error('A quantidade de registros (\'tamanho-pagina\') não deve ser informada para o Grid sob demanda, pois deve ser controlada manualmente');
					}

				} else if (self.data) {
					self.totalRegistros = self.data.length;
				}
			}

			if (self.acaoSelecionar !== undefined) {
				$scope.$watch("grid.itemSelecionado", function () {
					if (self.itemSelecionado !== undefined) {
						self.acaoSelecionar();
					}
				});
			}

			function _acaoGrid() {
				if (self.acaoPaginacao) {
					self.acaoPaginacao({
						pagina: self.pagina
					});
				}
				if (self.gridMemoria) {
					aplicarFiltroMemoria();
				} else {
					self.registrosPaginados = _getData();
					_verificacoes();
					self.gridMemoria = self.data.length == self.totalRegistros;
					self.totalPaginas = Math.ceil(self.totalRegistros / self.tamanhoPagina);
				}
			}

			$scope.$watch("grid.data", function () {
				_acaoGrid();
			});

			$scope.$watch("grid.pagina", function () {
				_acaoGrid();
				self.todosSelecionados = false;
			});
		}
	};

	function paginateArray() {
		return function (arr, start, end) {
			return (arr || []).slice(start, end);
		};
	};
})();
