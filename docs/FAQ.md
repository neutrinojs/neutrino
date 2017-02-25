# FAQ

### What is the added value versus all the boilerplate projects out there like [create-react-app](https://github.com/facebookincubator/create-react-app)?

The proliferation of boilerplate and metapackages is one thing we are trying to reduce. These types of projects 
are great, and do serve a purpose. But what if you wanted to make a configuration change across all your
projects? You must make config changes in many places, including the original boilerplate, whereas presets
give you the power to confine these changes to a single package. Some of these projects also make a tradeoff
between ease of set up and black-boxing the configuration. Once you decide to make a configuration change,
you are forced to maintain the entire configuration and its dependencies in perpetuity. We believe Neutrino
represents a good balance between ease of set up and future extensibility.
