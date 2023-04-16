@use 'sass:math';

.icon-svg {
	display: inline-block;
	vertical-align: middle;
	position: relative;
	&__svg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		fill: currentColor;
		pointer-events: none;
		transform: translateZ(0);
	}
	&::before {
		content: '';
		display: block;
	}

	<% _.each(glyphs, function(glyph) { %>
	&--<%= glyph.name %> {
		width: <%= glyph.width %>px;
		&::before {
			padding-top: math.percentage(math.div(<%= glyph.height %>, <%= glyph.width %>));
		}
	}
	<% }); %>
}
