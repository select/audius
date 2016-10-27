Variables
======

## Time

```js
$transition-time: 250ms
```

## Space


### Grid base
This is the most important variable since all grid values are based on it

```js
$grid-space: 7px
```

### Input shadows
Default shadow for buttons that need a shadow.

```js
+card(1)
+card(2)
+card(3)
```

### Touch sizes
Touch sizes are multiples of `$grid-size` (7px) they are used for all buttons and similar elements like striped list.

```js
$touch-size-extratiny: 21px
$touch-size-tiny: 28px
$touch-size-small: 35px
$touch-size-medium: 49px
$touch-size-large: 56px
$touch-size-huge: 63px
```

### Border radius

```js
$border-radius: 3px
```

### Icon font sizes
For different touch buttons with icons we need different icon font sizes.

```js
$icon-size: 28px
$icon-size-small: 23px
$icon-size-tiny: 18px
```

### Scrollbar
Scrollbar width, this is sometimes necessary if we expect a scrollbar could appear on overflowing content. This value is not aribtrily chosen. **Don't change!** Please read, to learn more https://www.google.de/search?q=scrollbar+width

```js
$scroll-bar-size: 17px
```


## Font-Sizes
This are all font sizes

```js
$font-size-small: 12px
$font-size-medium: 14px
$font-size-normal: 16px
$font-size-large: 18px
$font-size-xlarge: 24px
$font-size-xxlarge: 38px
```

