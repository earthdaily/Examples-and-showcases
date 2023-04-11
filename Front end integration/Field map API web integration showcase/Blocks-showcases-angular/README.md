# BlocksShowcaseAngular

This project demonstrates how to integrate Geosys Micro Front Ends (MFEs) AKA Geosys Blocks.
This solution is a very basic App Shell and loads 2 Micro Front Ends.

## How to run the App

Get a Geosys Account for Pre-Production environment and set login information in environment.ts file. If you do not have a Geosys Demo account, please contact EarthDaily Agro Sales Team

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Notice

This sample use a very simple way of authenticating on Geosys Platform, in order to get an Access Token. For a "real world" application implementation, additional technical information will be provided for federating your identity solution with the Geosys identity platform.

Refreshing The access token when it expires is not implemented here. If it expires, you may have to refresh the page.

All urls are hardcoded and bond to the Pre-Production Geosys Platform

## How was this sample built?

- Created an empty Angular App
- Added Angular material
- Added https://github.com/angular-architects/module-federation-plugin
- Update webpack.config.js to disable library sharing
- Created components and used module federation with programmatic loading, using loadRemoteModule()

