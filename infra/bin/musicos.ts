#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { MusicOSStack } from '../lib/musicos-stack';

const app = new cdk.App();

new MusicOSStack(app, 'MusicOSStack', {
  description: 'MusicOS activity data infrastructure',
});
