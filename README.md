# hue404

Node service to control [Art404's](http://www.art404.com) hue lighting with various apis.

Currently a mishmash of a true service + [hue-twitter](https://github.com/mannynotfound/hue-twitter). 
Eventually hue-twitter will just be a recipe consume by this service.

## Usage

Set up the environment variables listed in `env.example`

* DEV: `npm run dev`
* NON-DEV: `node server`

## APIs

### Twiter

#### On
`@username lights on`

#### Off
`@username lights off`

#### Single Color
`@username chartreuse`

#### Multi Color
`@username coral salmon papaya whip crimson`

## Supported Colors:

```js
[
  "white",
  "red",
  "green",
  "blue",
  "brown",
  "chartreuse",
  "chocolate",
  "coral",
  "cyan",
  "fuschia",
  "gold",
  "hot pink",
  "indigo",
  "lime",
  "magenta",
  "navy",
  "orchid",
  "olive",
  "orange",
  "papaya whip",
  "pink",
  "plum",
  "purple",
  "salmon",
  "teal",
  "tomato",
  "yellow"
]
```

## TODO:
* Break apart APIs into 'recipes' that can be developed independently

