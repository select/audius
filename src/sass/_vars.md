Variables
======

## Time

```js
$transition-time: 250ms
```

## Space

### Base Font Size

```js
$base-font-size: 2.3vmin
```

### Grid base
This is the most important variable since all grid values are based on it

```js
$grid-space: 0.45em
```

### Input shadows
Default shadow for buttons that need a shadow.

```js
+card(1)
+card(2)
+card(3)
```

### Touch sizes
Touch sizes are multiples of `$grid-size` they are used for all buttons and similar elements like striped list.

```js
$touch-size-extratiny: 3*$grid-space
$touch-size-tiny:      4*$grid-space
$touch-size-small:     5*$grid-space
$touch-size-medium:    7*$grid-space
$touch-size-large:     8*$grid-space
$touch-size-huge:      9*$grid-space
```

### Border radius

```js
$border-radius: 2px
```

### Scrollbar
```js
::-webkit-scrollbar
	width: 5px
	&:hover
		width: 10px

::-webkit-scrollbar-track
  background: $color-catskillwhite

::-webkit-scrollbar-thumb
  background: $color-aluminium-dark
```

### Input Placeholder

Use the `placeholder`  mixin.

```js
input
	width: 18em
	+placeholder
		color: $color-pictonblue
```

