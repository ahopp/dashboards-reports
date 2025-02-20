/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import React from 'react';
import {
  render,
  waitFor,
  waitForElement,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { ReportTrigger } from '../report_trigger';
import 'babel-polyfill';
import 'regenerator-runtime';
import httpClientMock from '../../../../../test/httpMockClient';
import { act } from 'react-dom/test-utils';
import moment from 'moment-timezone';

const names = jest.fn();

const emptyRequest = {
  report_params: {
    report_name: '',
    report_source: '',
    description: '',
    core_params: {
      base_url: '',
      report_format: '',
      time_duration: '',
    },
  },
  delivery: {
    delivery_type: '',
    delivery_params: {},
  },
  trigger: {
    trigger_type: '',
    trigger_params: {},
  },
  time_created: 0,
  last_updated: 0,
  status: '',
};

describe('<ReportTrigger /> panel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('render create component', () => {
    let createReportDefinitionRequest = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          base_url: '',
          report_format: '',
          header: '',
          footer: '',
          time_duration: '',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {},
      },
    };

    let timeRange = {
      timeFrom: new Date(),
      timeTo: new Date(),
    };

    const { container } = render(
      <ReportTrigger
        edit={false}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showCronError={false}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  // edit test
  test('render edit recurring 5 hours schedule component', async () => {
    const promise = Promise.resolve();
    let report_definition = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          base_url: '',
          report_format: '',
          header: '',
          footer: '',
          time_duration: '',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {
          schedule_type: 'Recurring',
          schedule: {
            interval: {
              period: 5,
              unit: 'HOURS',
              timezone: 'PST8PDT',
            },
          },
          enabled_time: 1114939203,
          enabled: true,
        },
      },
    };

    let timeRange = {
      timeFrom: new Date(),
      timeTo: new Date(),
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition,
    });

    const { container } = render(
      <ReportTrigger
        edit={true}
        editDefinitionId={'1'}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showCronError={true}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('render edit recurring daily schedule component', async () => {
    const promise = Promise.resolve();
    let editReportDefinitionRequest = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          base_url: '',
          report_format: '',
          header: '',
          footer: '',
          time_duration: '',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {
          schedule_type: 'Recurring',
          schedule: {
            interval: {
              period: 1,
              unit: 'DAYS',
              start_time: 1114939203,
            },
          },
          enabled_time: 1114939203,
          enabled: true,
        },
      },
    };

    let timeRange = {
      timeFrom: new Date(),
      timeTo: new Date(),
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition: editReportDefinitionRequest,
    });

    const { container } = render(
      <ReportTrigger
        edit={true}
        editDefinitionId={'1'}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showCronError={true}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('render edit Cron schedule component', async () => {
    const promise = Promise.resolve();
    let cronReportDefinitionRequest = {
      report_params: {
        report_name: 'edit cron schedule component',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          base_url: '',
          report_format: '',
          header: '',
          footer: '',
          time_duration: '',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {
          schedule_type: 'Cron based',
          schedule: {
            cron: {
              expression: '30 1 * * *',
              timezone: 'PDT',
            },
          },
          enabled_time: 1234567890,
          enabled: true,
        },
      },
    };

    let timeRange = {
      timeFrom: new Date(),
      timeTo: new Date(),
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition: cronReportDefinitionRequest,
    });

    const { container } = render(
      <ReportTrigger
        edit={true}
        editDefinitionId={'2'}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showTriggerIntervalNaNError={false}
        showCronError={true}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('render edit recurring 10 minutes schedule component', async () => {
    const promise = Promise.resolve();
    let editReportDefinitionRequest = {
      report_params: {
        report_name: 'test create report definition trigger',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          base_url: '',
          report_format: '',
          header: '',
          footer: '',
          time_duration: '',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'Schedule',
        trigger_params: {
          schedule_type: 'Recurring',
          schedule: {
            interval: {
              period: 10,
              unit: 'MINUTES',
              start_time: 1114939203,
            },
          },
          enabled_time: 1114939203,
          enabled: true,
        },
      },
    };

    let timeRange = {
      timeFrom: new Date(),
      timeTo: new Date(),
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition: editReportDefinitionRequest,
    });

    const { container } = render(
      <ReportTrigger
        edit={true}
        editDefinitionId={'1'}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showCronError={false}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });

  test('Render edit on-demand component', async () => {
    const promise = Promise.resolve();
    let editReportDefinitionRequest = {
      report_params: {
        report_name: 'edit cron schedule component',
        report_source: 'Dashboard',
        description: '',
        core_params: {
          base_url: '',
          report_format: '',
          header: '',
          footer: '',
          time_duration: '',
        },
      },
      delivery: {
        delivery_type: '',
        delivery_params: {},
      },
      trigger: {
        trigger_type: 'On demand',
      },
    };

    let timeRange = {
      timeFrom: new Date(),
      timeTo: new Date(),
    };

    httpClientMock.get = jest.fn().mockResolvedValue({
      report_definition: editReportDefinitionRequest,
    });

    const { container } = render(
      <ReportTrigger
        edit={true}
        editDefinitionId={'1'}
        reportDefinitionRequest={emptyRequest}
        httpClientProps={httpClientMock}
        timeRange={timeRange}
        showCronError={true}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
    await act(() => promise);
  });
});
