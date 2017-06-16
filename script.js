d3.csv("crash.csv", function(d) {
			return {
				kmSemaine: +d.avail_seat_km_per_week,
				accidents85: +d.incidents_85_99,
				accidentsMortels85: +d.fatal_accidents_85_99,
				morts85: +d.fatalities_85_99,
				accidents00: +d.incidents_00_14,
				accidentsMortels00: +d.fatal_accidents_00_14,
				morts00: +d.fatalities_00_14,
				compagnie: d.airline,
				continent: d.continent
			};
		}, function(data) {
			let marge = 20;
			let largeur = (window.innerWidth - (2 * marge)) / 2;
			let hauteur = (window.innerHeight - (2 * marge)) / 2;
			let optionsCompagnie = [];

			/*
			A partir de là c'est très moche et bordélique, mais c'est pour avoir 
			des jolies options dans les menus déroulants
			*/

			let optionsAxes = [
				"kmSemaine",
				"accidents",
				"accidentsMortels",
				"morts"];

			let optionsAxes2 = [
				"Km par semaine",
				"Accidents",
				"Accidents mortels",
				"Morts"
			];
			let optionsPeriode = [
				"1985-2000",
				"2000-2014",
				"1985-2014"];

			let options = [{
				"kmSemaine" : "kmSemaine",
				"accidents" : "accidents85",
				"accidentsMortels" : "accidentsMortels85",
				"morts" : "morts85"
				},
				{
				"kmSemaine" : "kmSemaine",
				"accidents" : "accidents00",
				"accidentsMortels" : "accidentsMortels00",
				"morts" : "morts00"
				},
				{
				"kmSemaine" : "kmSemaine",
				"accidents" : "accidents",
				"accidentsMortels" : "accidentsMortels",
				"morts" : "morts"
				}
			];

			let label = {
				"kmSemaine" : "Kilomètres par semaine",
				"accidents" : "Accidents",
				"accidentsMortels" : "Accidents mortels",
				"morts" : "Morts"
			};

			//Fin de la laideur et du bordel

			//On réorganise les données grâce à d3.nest (cf. Mister Nester pour comprendre) (attention il manque un $)
			let nestCompagnies = d3.nest()
				.key(d => d.compagnie)
				.map(data);

			//Addition des deux périodes et création de la liste des compagnies
			for (var i = 0; i <= 55; i++) {
				data[i].accidents = data[i].accidents85 + data[i].accidents00,
					data[i].accidentsMortels = data[i].accidentsMortels85 + data[i].accidentsMortels00,
					data[i].morts = data[i].morts85 + data[i].morts00,
					optionsCompagnie[i] = data[i].compagnie;
			}

			//Création des menus déroulants
			optionsAxes.forEach(function(d, i) {
				d3.select("#selectX")
					.append("option")
					.attr("value", d)
					.text(optionsAxes2[i]);
			})

			optionsAxes.forEach(function(d,i) {
				d3.select("#selectY")
					.append("option")
					.attr("value", d)
					.text(optionsAxes2[i]);
			})

			optionsPeriode.forEach(function(d, i) {
				d3.select("#selectPeriode")
					.append("option")
					.attr("value", i)
					.text(d);
			})

			optionsCompagnie.forEach(function(d) {
				d3.select("#selectCompagnie")
					.append("option")
					.attr("value", d)
					.text(d);
			})

			//Quand on choisit une valeur, on retient la valeur choisie et on lance la fonction graphe avec
			//cette nouvelle valeur
			function choixX() {
				var indexPeriode = d3.select("#selectPeriode").property('value')
				var variableX = d3.select(this).property('value')
				var variableY = d3.select("#selectY").property('value')
				var abs = options[indexPeriode][variableX]
				var ord = options[indexPeriode][variableY]
				var legX = label[variableX]
				var legY = label[variableY]
				graphe(abs, ord, legX, legY)
			}

			function choixY() {
				var indexPeriode = d3.select("#selectPeriode").property('value')
				var variableX = d3.select("#selectX").property('value')
				var variableY = d3.select(this).property('value')
				var abs = options[indexPeriode][variableX]
				var ord = options[indexPeriode][variableY]
				var legX = label[variableX]
				var legY = label[variableY]
				graphe(abs, ord, legX, legY)
			}

			function choixCompagnie() {
				var compagnieChoisie = "$" + d3.select(this).property('value')
				//Easter egg Joris Delacroix
				if (compagnieChoisie == "$Air France") {
					window.open("https:www.youtube.com/watch?v=V4n6OjoPuJc")
				}
				graphe2(compagnieChoisie)
				//Et on relance la fonction graphe pour colorier le point correspondant en rouge
				var indexPeriode = d3.select("#selectPeriode").property('value')
				var abs = options[indexPeriode][d3.select("#selectX").property('value')]
				var ord = options[indexPeriode][d3.select("#selectY").property('value')]
				var legX = label[d3.select("#selectX").property('value')]
				var legY = label[d3.select("#selectY").property('value')]
				graphe(abs, ord, legX, legY)
			}

			function choixPeriode() {
				var indexPeriode = d3.select(this).property('value')
				var abs = options[indexPeriode][d3.select("#selectX").property('value')]
				var ord = options[indexPeriode][d3.select("#selectY").property('value')]
				var legX = label[d3.select("#selectX").property('value')]
				var legY = label[d3.select("#selectY").property('value')]
				graphe(abs, ord, legX, legY)
			}

			d3.select("#selectX")
				.on("change", choixX)

			d3.select("#selectY")
				.on("change", choixY)

			d3.select("#selectCompagnie")
				.on("change", choixCompagnie)

			d3.select("#selectPeriode")
				.on("change", choixPeriode)

			//Création des zones pour les graphes
			let canevas = d3.select("body")
				.append("svg")
				.attr("height", hauteur + 2 * marge)
				.attr("width", largeur + 2 * marge)
				.append("g")
				.attr("transform", "translate(" + marge + "," + marge + ")");

			let canevas2 = d3.select("body")
				.append("svg")
				.attr("height", hauteur + 2 * marge)
				.attr("width", largeur + 2 * marge)
				.append("g")
				.attr("transform", "translate(" + marge + "," + marge + ")");

			//Création du tooltip
			let div = d3.select("body").append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);



			/*Fonction qui prend un argument à mettre en X, un argument en Y
			et qui crée une visualisation en fonction de ces deux argumetns*/

			function graphe(abs, ord, legX, legY) {

				//Régression linéaire
				var lr = {};
				var n = data.length;
				var sum_x = 0;
				var sum_y = 0;
				var sum_xy = 0;
				var sum_xx = 0;
				var sum_yy = 0;
				var max = d3.max(data, d => d[abs]);

				for (var i = 0; i < data.length; i++) {
					sum_x += data[i][abs];
					sum_y += data[i][ord];
					sum_xy += (data[i][abs] * data[i][ord]);
					sum_xx += (data[i][abs] * data[i][abs]);
					sum_yy += (data[i][ord] * data[i][ord]);
				}

				lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
				lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
				lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) /
					Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);


				//Initialisation des échelles
				var echelleX = d3.scaleLinear()
					.domain([0, d3.max(data, d => d[abs])])
					.range([marge, largeur - marge]);

				var echelleY = d3.scaleLinear()
					.domain([0, d3.max(data, d => d[ord])])
					.range([hauteur - marge, marge]);

				var echelleCouleur = d3.scaleOrdinal()
					.domain(["Europe", "South America", "North America", "Asia",
						"Australia", "Africa"
					])
					.range([0, 1 / 5, 2 / 5, 3 / 5, 4 / 5, 1]);

				//Initialisation des cercles et de la ligne pour la régression
				var cercles = canevas.selectAll("circle").data(data);
				var ligne = canevas.selectAll("line").data(data);

				//Au début, tous les cercles sont invisibles en bas à gauche
				cercles.enter()
					.append("circle")
					.attr("cx", d => echelleX(0))
					.attr("cy", d => echelleY(0))
					.attr("r", 0)
					.attr("opacity", 0)
				//Les deux "if" servent à colorier en rouge le point qui correspond à la compagnie choisie par le user
				cercles.transition()
					.duration(500)
					.attr("cx", d => echelleX(d[abs]))
					.attr("cy", d => echelleY(d[ord]))
					.attr("r", 4)
					.attr("opacity", function(d) {
						if (d.compagnie == d3.select("#selectCompagnie").property('value')) {
							return 1
						} else {
							return 0.4
						};
					})
					.attr("fill", function(d) {
						if (d.compagnie == d3.select("#selectCompagnie").property('value')) {
							return "red"
						} else {
							return d3.interpolateCool(echelleCouleur(d.continent))
						};
					})

				cercles.exit()
					.remove()

				cercles.on("mouseover", function(d) {
						d3.select(this)
							.attr("r", 6)
						div.transition()
							.duration(200)
							.style("opacity", .9)
						div.html("<b>Airline : </b>" + d.compagnie + "<br><b>Continent : </b>" + d.continent)
							.style("left", (d3.event.pageX) + "px")
							.style("top", (d3.event.pageY - 28) + "px");
					})
					.on("mouseout", function(d) {
						d3.select(this)
							.attr("r", 4)
						div.transition()
							.duration(200)
							.style("opacity", 0);
					})

				//On rajoute la régression, au début elle est blanche et on la voit pas
				ligne.enter()
					.append("line")
					.attr("x1", echelleX(0))
					.attr("y1", echelleY(lr['intercept']))
					.attr("x2", echelleX(max))
					.attr("y2", echelleY((max * lr['slope']) + lr['intercept']))
					.style("stroke", "rgb(255,255,255)");

				ligne.transition()
					.duration(500)
					.attr("x1", echelleX(0))
					.attr("y1", echelleY(lr['intercept']))
					.attr("x2", echelleX(max))
					.attr("y2", echelleY((max * lr['slope']) + lr['intercept']))
					.style("stroke", "#eaaa07");

				//Création des deux axes

				var axeX = d3.axisBottom(echelleX);
				var axeY = d3.axisLeft(echelleY);

				//Axe X avec la légende
				canevas.append("g")
					.attr("transform", `translate(0,${hauteur-marge})`)
					.attr("class", "axeHorizontal")
					.call(axeX.tickFormat(d3.format(",.0s")));

				canevas.append("text")
					.attr("class", "axeHorizontalLegende")
					.attr("transform", "translate(" + (largeur / 2) + " ," + (hauteur + marge / 2) + ")")
					.style("text-anchor", "middle")
					.text(abs);

				//Axe Y avec sa légende
				canevas.append("g")
					.attr("transform", `translate(${marge},0)`)
					.attr("class", "axeVertical")
					.call(axeY.tickFormat(d3.format(",.0s")));

				canevas.append("text")
					.attr("class", "axeVerticalLegende")
					.attr("transform", "rotate(-90)")
					.attr("y", 0)
					.attr("x", -hauteur / 2)
					.style("text-anchor", "end")
					.text(ord);

				//Rafraîchissement des axes, des légendes et du titre
				canevas.selectAll(".axeHorizontal")
					.call(axeX
						.ticks(4)
						.tickFormat(d3.format(",.00s")));

				canevas.selectAll(".axeHorizontalLegende")
					.text(legX);

				canevas.selectAll(".axeVertical")
					.call(axeY
						.ticks(4)
						.tickFormat(d3.format(",.00s")));

				canevas.selectAll(".axeVerticalLegende")
					.text(legY);
			}

			function graphe2(funcComp) {

				var echelleX = d3.scaleLinear()
					.domain([0, d3.max(data, d => d.accidents)])
					.range([0, largeur - marge]);

				var axeX = d3.axisBottom(echelleX);

				var echelleCouleurAccMort = d3.scaleLinear()
					.domain([d3.min(data, d => d.accidentsMortels),d3.max(data, d => d.accidentsMortels)])
					.range(["#ff3333","#b30000"]);

				var echelleCouleurAcc = d3.scaleLinear()
					.domain([d3.min(data, d => d.accidents),d3.max(data, d => d.accidents)])
					.range(["#4dc3ff","#0088cc"]);

				var gap = 10;
				var hauteurRect = hauteur / 10;
				var accidentsMoyens = d3.mean(data, d => d.accidents);
				var accidentsMortelsMoyens = d3.mean(data, d => d.accidentsMortels);

				var g = canevas2.selectAll("g").data(data);

				var gEnter = g.enter().append("g");
				//Référence des accidents moyens
				gEnter.append("rect").attr("class", "rect1")
					.attr("opacity", 0.5)
					.attr("x", marge)
					.attr("y", marge)
					.attr("height", hauteurRect)
					.attr("width", echelleX(accidentsMoyens))
					.attr("fill", "#e6f7ff")
					.on("mouseover", function(d) {
						div.transition()
							.duration(200)
							.style("opacity", .9)
						div.html("<b>Nombre moyen d'accidents : </b>" + Math.round(accidentsMoyens))
							.style("left", (d3.event.pageX) + "px")
							.style("top", (d3.event.pageY - 28) + "px");
					})
					.on("mouseout", function(d) {
						div.transition()
							.duration(200)
							.style("opacity", 0);
					})
				//Référence des accidents mortels moyens
				gEnter.append("rect").attr("class", "rect2")
					.attr("opacity", 0.5)
					.attr("x", marge)
					.attr("y", marge + 2 * (hauteurRect + gap))
					.attr("height", hauteurRect)
					.attr("width", echelleX(accidentsMortelsMoyens))
					.attr("fill", "#ffd6cc")
					.on("mouseover", function(d) {
						div.transition()
							.duration(200)
							.style("opacity", .9)
						div.html("<b>Nombre moyen d'accidents mortels : </b>" + Math.round(accidentsMortelsMoyens))
							.style("left", (d3.event.pageX) + "px")
							.style("top", (d3.event.pageY - 28) + "px");
					})
					.on("mouseout", function(d) {
						div.transition()
							.duration(200)
							.style("opacity", 0);
					})
				//Accidents pour la compagnie sélectionnée
				gEnter.append("rect").attr("class", "rect3")
					.attr("x", marge)
					.attr("y", marge + hauteurRect + 0.2 * gap)
					.attr("width", echelleX(nestCompagnies[funcComp][0]["accidents"]))
					.attr("height", hauteurRect)
					.attr("fill", echelleCouleurAcc(nestCompagnies[funcComp][0]["accidents"]));

				canevas2.selectAll(".rect3").data(data).transition()
					.duration(500)
					.attr("x", marge)
					.attr("y", marge + hauteurRect + 0.2 * gap)
					.attr("width", echelleX(nestCompagnies[funcComp][0]["accidents"]))
					.attr("height", hauteurRect)
					.attr("fill", echelleCouleurAcc(nestCompagnies[funcComp][0]["accidents"]));
				//Accidents mortels pour la compagnie sélectionée
				gEnter.append("rect").attr("class", "rect4")
					.attr("x", marge)
					.attr("y", marge + 2 * (hauteurRect + gap) + hauteurRect + 0.2 * gap)
					.attr("width", echelleX(nestCompagnies[funcComp][0]["accidentsMortels"]))
					.attr("height", hauteurRect)
					.attr("fill", echelleCouleurAccMort(nestCompagnies[funcComp][0]["accidentsMortels"]));

				canevas2.selectAll(".rect4").data(data).transition()
					.duration(500)
					.attr("x", marge)
					.attr("y", marge + 2 * (hauteurRect + gap) + hauteurRect + 0.2 * gap)
					.attr("width", echelleX(nestCompagnies[funcComp][0]["accidentsMortels"]))
					.attr("height", hauteurRect)
					.attr("fill", echelleCouleurAccMort(nestCompagnies[funcComp][0]["accidentsMortels"]));

				//Les tooltips
				canevas2.selectAll(".rect3").data(data)
					.on("mouseover", function(d) {
						div.transition()
							.duration(200)
							.style("opacity", .9)
						div.html("<b>Accidents chez </b>" +
								nestCompagnies[funcComp][0]["compagnie"] + " : " + nestCompagnies[funcComp][0]["accidents"])
							.style("left", (d3.event.pageX) + "px")
							.style("top", (d3.event.pageY - 28) + "px");
					})
					.on("mouseout", function(d) {
						div.transition()
							.duration(200)
							.style("opacity", 0);
					})

				canevas2.selectAll(".rect4").data(data)
					.on("mouseover", function(d) {
						div.transition()
							.duration(200)
							.style("opacity", .9)
						div.html("<b>Accidents mortels chez </b>" +
								nestCompagnies[funcComp][0]["compagnie"] + " : " + nestCompagnies[funcComp][0]["accidentsMortels"])
							.style("left", (d3.event.pageX) + "px")
							.style("top", (d3.event.pageY - 28) + "px");
					})
					.on("mouseout", function(d) {
						div.transition()
							.duration(200)
							.style("opacity", 0);
					})

				//Axe X
				canevas2.append("g")
					.attr("transform", `translate(${marge},${5*hauteurRect+5*gap})`)
					.call(axeX.tickFormat(d3.format(",.0s")));

				canevas2.append("text")
					.attr("class", "axeHorizontalLegende")
					.attr("transform", "translate(" + (largeur / 2) + " ," + (6 * hauteurRect + 6 * gap) + ")")
					.style("text-anchor", "middle")
					.text("Nb d'accidents");



			}


			//On lance directement les fonctions pour qu'il y ait quelque chose en arrivant sur la page
			graphe("kmSemaine", "kmSemaine");
			graphe2("$Aer Lingus");

		});