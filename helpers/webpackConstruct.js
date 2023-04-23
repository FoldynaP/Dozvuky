const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const fse = require('fs-extra');
const config = require('./getConfig.js');
const path = require('path');
const cheerio = require('cheerio');
const htmlparser2 = require('htmlparser2');
const consolidate = require('consolidate');

function resolveTwigEntry() {
	const twigs = [];
	const templatesDir = path.resolve(__dirname, '../src/tpl');
	const viewsDir = path.resolve(__dirname, '../src/tpl/Views');
  
	// Add twig files from templates directory
	fs.readdirSync(templatesDir).forEach((file) => {
	  if (file.includes('.twig')) {
		const nameWithoutExt = file.split('.')[0];
		const outputPath = path.resolve(__dirname, `../dist`);
  
		// Create output directory if it doesn't exist
		fse.ensureDirSync(outputPath);
  
		// Add twig file to webpack entry points
		twigs.push({
		  name: nameWithoutExt,
		  entry: `./src/tpl/${nameWithoutExt}.twig`,
		  output: {
			path: outputPath,
			filename: `${nameWithoutExt}.html`
		  }
		});
	  }
	});
  
	// Add twig files from views directory
	const helperFile = [];
	fs.readdirSync(viewsDir).forEach((file) => {
		const nameWithoutExt = file.split('.')[0];
		const outputPath = path.resolve(__dirname, `../dist/${nameWithoutExt}`);
  
		// 	// Create output directory if it doesn't exist
		fse.ensureDirSync(outputPath);
		helperFile.push(file);
	}
	);
	for (file of helperFile) {
		if (fs.existsSync(path.resolve(__dirname, `../dist/${file}`))) {
			fs.readdirSync(path.resolve(__dirname, `../src/tpl/Views/${file}`)).forEach((subfile) => {
				const nameSubfileWithoutExt = subfile.split('.')[0];
					// Add twig file to webpack entry points
					twigs.push({
					  name: nameSubfileWithoutExt,
					  entry: `./src/tpl/Views/${file}/${nameSubfileWithoutExt}.twig`,
					  output: {
						path: path.resolve(__dirname, `../dist/${file}`),
						filename: `${nameSubfileWithoutExt}.html`
					  }
					});
					console.log(twigs)
			});
		}
	}
  
	const twigsArr = [];
	for (tw of twigs) {
		const name = tw.name.split('/')[tw.name.split('/').length - 1];
		const nameWithoutExt = name.split('.')[0];
	  twigsArr.push(
		new HtmlWebpackPlugin({
		  inject: true,
		  chunks: [tw.name],
		  //filename: `/${nameWithoutExt}.html`,
		  filename: `${tw.output.path}/${tw.output.filename}`,
		  template: tw.entry,
		})
	  );
	}
	return twigsArr;
  }

function myJsonToSassObject(varName, obj) {
	if (typeof obj === 'object') {
		const resultStrings = [];
		for (const key of Object.keys(obj)) {
			const value = obj[key];
			resultStrings.push(`${key}: '${value}'`);
		}
		return `${varName}: (${resultStrings.join(',')});`;
	}
	return `${varName}: '${obj}';`;
}

function createSassVars(config) {
	const { breakpoints = {}, rules = {}, breakpointsVars = {} } = config.mediaQueries;
	const varsObject = {
		...breakpointsVars,
		...rules,
		breakpoints,
		breakpointsVars,
		paths: config.assets,
	};
	const varsStrings = [];
	for (const key in varsObject) {
		varsStrings.push(myJsonToSassObject(`$${key}`, varsObject[key]));
	}
	return varsStrings.join('');
}

function copyToMvc() {
	fse.emptyDirSync(config.basePath.mvc);
	fse.copySync(path.resolve(__dirname, `../${config.basePath.dest}`), config.basePath.mvc, { overwrite: true });
	fse.emptyDirSync(config.basePath.customElements);
	fse.copySync(path.resolve(__dirname, `../${config.basePath.dest}`), config.basePath.customElements, { overwrite: true });
}

class CopyToMVCPlugin {
	apply(compiler) {
		compiler.hooks.done.tap('CopyToMVCPlugin', (compilation) => {
			copyToMvc();
		});
	}
}

function listSvgs(dir) {
	var items = fs.readdirSync(dir);
	const files = [];
	for (const item of items) {
		const newPath = path.join(dir, item);

		if (fs.statSync(newPath).isDirectory()) {
			files.push(...listSvgs(newPath));
		} else if (newPath.endsWith('.svg')) {
			files.push(newPath);
		}
	}
	return files;
}

class iconSvgCssGeneratePlugin {
	apply(compiler) {
		compiler.hooks.watchRun.tap('iconSvgCssGeneratePlugin', (compilation) => {
			const svgFiles = listSvgs('./src/img/bg/icons-svg');
			const viewBoxes = [];

			svgFiles.forEach((newFile) => {
				const svgFile = fs.readFileSync(newFile);

				const svgFileString = svgFile.toString();

				const dom = htmlparser2.parseDocument(svgFileString, {});
				const $ = cheerio.load(dom);

				const symbol = $('svg');
				const nameReplaced = newFile.replaceAll('\\', '/');
				const name = nameReplaced.split('/')[nameReplaced.split('/').length - 1].replace('.svg', '');
				const viewbox = symbol[0].attribs.viewbox;
				if (viewbox) {
					symbol.attr('viewBox', viewbox);
					symbol.removeAttr('viewbox');
				}

				let viewBox = symbol[0].attribs.viewBox;

				if (!viewBox) {
					viewBox = `0 0 ${symbol[0].attribs.width} ${symbol[0].attribs.height}`;
				}

				if (viewBox) {
					viewBox = viewBox.split(' ');
				}
				viewBoxes.push({
					name,
					width: viewBox && viewBox.length >= 2 ? viewBox[2] : 20,
					height: viewBox && viewBox.length >= 2 ? viewBox[2] : 20,
				});
			});

			consolidate.lodash(
				`${config.src.styles}tpl/icons-svg.css.tpl`,
				{
					glyphs: viewBoxes,
				},
				(err, html) => {
					if (html) {
						if (!fs.existsSync(`${config.src.styles}core/generated`)) {
							fs.mkdirSync(`${config.src.styles}core/generated`);
						}
						fs.writeFileSync(`${config.src.styles}core/generated/icons-svg.scss`, html);
					}
				},
			);
		});
	}
}

class iconSvgCssGeneratePluginBeforeRun {
	apply(compiler) {
		compiler.hooks.beforeRun.tap('iconSvgCssGeneratePlugin', (compilation) => {
			const svgFiles = listSvgs('./src/img/bg');
			const viewBoxes = [];

			svgFiles.forEach((newFile) => {
				const svgFile = fs.readFileSync(newFile);

				const svgFileString = svgFile.toString();

				const dom = htmlparser2.parseDocument(svgFileString, {});
				const $ = cheerio.load(dom);

				const symbol = $('svg');
				const nameReplaced = newFile.replaceAll('\\', '/');
				const name = nameReplaced.split('/')[nameReplaced.split('/').length - 1].replace('.svg', '');
				const viewbox = symbol[0].attribs.viewbox;
				if (viewbox) {
					symbol.attr('viewBox', viewbox);
					symbol.removeAttr('viewbox');
				}

				let viewBox = symbol[0].attribs.viewBox;

				if (!viewBox) {
					viewBox = `0 0 ${symbol[0].attribs.width} ${symbol[0].attribs.height}`;
				}

				if (viewBox) {
					viewBox = viewBox.split(' ');
				}
				viewBoxes.push({
					name,
					width: viewBox && viewBox.length >= 2 ? viewBox[2] : 20,
					height: viewBox && viewBox.length >= 2 ? viewBox[2] : 20,
				});
			});

			consolidate.lodash(
				`${config.src.styles}tpl/icons-svg.css.tpl`,
				{
					glyphs: viewBoxes,
				},
				(err, html) => {
					if (html) {
						if (!fs.existsSync(`${config.src.styles}core/generated`)) {
							fs.mkdirSync(`${config.src.styles}core/generated`);
						}
						fs.writeFileSync(`${config.src.styles}core/generated/icons-svg.scss`, html);
					}
				},
			);
		});
	}
}

module.exports = {
	resolveTwigEntry,
	createSassVars,
	CopyToMVCPlugin,
	iconSvgCssGeneratePlugin,
	iconSvgCssGeneratePluginBeforeRun,
};
