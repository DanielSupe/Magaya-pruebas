import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import './BrandCustom.scss';
import {
  Label,
  Input,
  Form,
  Card,
  Col,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  Alert,
} from 'reactstrap';
import {
  Buttons,
  CancelButton,
  UpdateButton,
} from '../../../components/Common/IpopUp';
import { updateStyleDocument } from '../../../helpers/tools_helper';
import { IInput } from '../../../components/Common/iInput';

import Dropzone, { DropzoneOptions } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { changeLayoutWidth, updateImageClients } from '../../../store/actions';
import { Row } from 'reactstrap';

import classnames from 'classnames';
import Swal from 'sweetalert2';
import { ToggleButton } from '@mui/material';
import { Toggle } from 'react-bootstrap/lib/Dropdown';
import { ISwitch } from '../../../components/Common/iSwitch';
import Widgets from '../../Dashboard/Widgets';
import Orders from '../../Dashboard/Orders';
import MarketOverview from '../../Dashboard/MarketOverview';
import MultiColor from '../../../components/Common/MultiColor';
const FormClientBrandCustom = ({
  selectedRow,
  onUpdateClient,
  onCancel,
}: any) => {
  const dispatch = useDispatch();
  const { clients } = useSelector((state: any) => state.clients);

  const arrayUpdAdd = [
    'primaryColor',
    'secondaryColor',
    'sidebarBgColor',
    'headerBgColor',
    'primaryDarkColor',
    'secondaryDarkColor',
    'headerDarkBgColor',
  ];
  const columsPop = 2;
  const toggleField = 'enabled';
  const [form, setForm] = useState({
    [toggleField]: false,
    name: '',
    email: '',
    company: '',
    description: '',
    logo: '',
    logoSmall: '',
    primaryColor: '',
    secondaryColor: '',
    primaryDarkColor: '',
    secondaryDarkColor: '',
    sidebarBgColor: '',
    headerBgColor: '',
    headerDarkBgColor: '',
    smtpEmail: '',
    smtpPassword: '',
    smtpHost: '',
    smtpPort: '',
    smtpsecure: false,
    smtpAccesstoken: '',
    lineGraphicTitle: '',
    lineGraphicColor: '',
    donutGraphicTitle: '',
    donutGraphicColor: [],
    barGraphicTitle: '',
    barGraphicColor: [],
  });
  const [flag, setflag] = useState<any>(true);

  type TabEmailType = {
    smtpEmail: string;
    smtpPassword: string;
    smtpHost: string;
    smtpPort: string;
    smtpsecure: boolean;
    smtpAccesstoken: string;
  };

  //-----------------------------------------------------

  const ListEmail: Array<keyof TabEmailType> = [
    'smtpEmail',
    'smtpPassword',
    'smtpHost',
    'smtpPort',
    'smtpAccesstoken',
    'smtpsecure',
  ];

  interface DashboardColorsState {
    CardColorTitle: string;
    LineColor: string;
    DonutsColorTitle: string;
    colorsDonuts: { value: string; label: string }[];
    BartColorTitle: string;
    colorsBart: { value: string; label: string }[];
  }

  const initialState: DashboardColorsState = {
    CardColorTitle: '',
    LineColor: '',
    DonutsColorTitle: '',
    colorsDonuts: [],
    BartColorTitle: '',
    colorsBart: [],
  };

  const [DashboardColors, setDashboardColors] = useState(initialState);

  const DashboardColorsMap = [
    {
      title: 'Cards color',
      campos: {
        TituloCampo1: 'Title Text Color',
        isMulti1: false,
        TituloCampo2: 'Line Color',
        isMulti2: false,
        namePropTitle: 'CardColorTitle',
        namePropColors: 'LineColor',
      },
    },
    { grafica: 'Line' },
    {
      title: 'Donuts color',
      campos: {
        TituloCampo1: 'Title Text Color',
        isMulti1: false,
        TituloCampo2: 'Colors',
        isMulti2: true,
        namePropTitle: 'DonutsColorTitle',
        namePropColors: 'colorsDonuts',
      },
    },
    { grafica: 'Donuts' },
    {
      title: 'Bars color',
      campos: {
        TituloCampo1: 'Title Text Color',
        isMulti1: false,
        TituloCampo2: 'Colors',
        isMulti2: true,
        namePropTitle: 'BartColorTitle',
        namePropColors: 'colorsBart',
      },
    },
    { grafica: 'Bart' },
  ];

  const onChangeBooleanHandler = (e: any, n: any) => {
    setForm({
      ...form,
      smtpsecure: !form.smtpsecure,
    });
  };

  const LineExample: any = [
    {
      id: 1,
      title: 'Line Cards',
      price: '0',
      isDoller: true,
      postFix: ``,
      statusColor: success,
      series: ['0', '0', '2', '1', '3', '0'],
    },
  ];

  const inicialStateDonuts = {
    id: 3,
    key: 3,
    title: 'Example Donut',
    price: 1,
    isDoller: false,
    colors: ['#1c22ce'],
    labels: ['Example Donut'],
    options: {
      ColorTitle: DashboardColors.DonutsColorTitle || '#495057',
      chart: { type: 'donut' },
      colors: ['#1c22ce'],
      dataLabels: { enabled: false },
      labels: ['Example Donut'],
      legend: { show: false },
      responsive: [{}],
      states: { hover: {} },
      stroke: { width: 0 },
      tooltip: { enabled: true },
    },
    postFix: '',
    series: [1],
    statusColor: 'success',
  };

  const inicialStateBart = [
    {
      labels: ['Example Bar'],
      Profit: ['50'],
      Loss: ['0', '0'],
      colors: ['#1c22ce'],
      titleBar: 'Example Bar',
      ColorTitle: DashboardColors.BartColorTitle || '#495057',
    },
  ];

  const [DonutsExample, setDonutsExample] = useState(inicialStateDonuts);
  const [BarExample, setBarExample] = useState(inicialStateBart);

  const onChangeHandlerMultiColors = (color:any, Colors:any, isMulti:any) => {
    if (
      isMulti === false
    ) {
      setDashboardColors({
        ...DashboardColors,
        [Colors]: color,
      });
      return;
    }

    if (
      (DashboardColors[
        Colors as keyof DashboardColorsState
      ] as string | undefined) &&
      DashboardColors[
        Colors as keyof DashboardColorsState
      ].length < 10
    ) {
      const currentColors =
        DashboardColors[
          Colors as keyof DashboardColorsState
        ];
      const newColors: {
        value: any;
        label: any;
      }[] = Array.isArray(currentColors)
        ? [
            ...currentColors,
            {
              value: color,
              label: color,
            },
          ]
        : [
            {
              value: color,
              label: color,
            },
          ];

      setDashboardColors({
        ...DashboardColors,
        [Colors]: newColors,
      });
    }
  };

  const updateForm = (
    title: any,
    colors: any,
    titleprop: any,
    colorsprop: any,
  ) => {
    setForm({
      ...form,
      [title]: titleprop,
      [colors]: colorsprop,
    });
  };

  useEffect(() => {
    updateForm(
      'lineGraphicTitle',
      'lineGraphicColor',
      DashboardColors.CardColorTitle,
      DashboardColors.LineColor,
    );
  }, [DashboardColors.CardColorTitle, DashboardColors.LineColor]);

  useEffect(() => {
    //-----------------------------------------------------
    updateForm(
      'donutGraphicTitle',
      'donutGraphicColor',
      DashboardColors.DonutsColorTitle,
      DashboardColors.colorsDonuts,
    );
    if (DashboardColors.colorsDonuts.length != 0) {
      const newState: any = DashboardColors.colorsDonuts.map(
        ({ label }) => label,
      );
      setDonutsExample({
        id: 3,
        key: 3,
        title: 'Example Donuts',
        price: 1,
        isDoller: false,
        colors: newState.filter((a: any) => {
          return a != undefined;
        }),
        labels: newState.filter((a: any) => {
          return a != undefined;
        }),
        options: {
          ColorTitle: DashboardColors.DonutsColorTitle || '#495057',
          chart: { type: 'donut' },
          colors: newState.filter((a: any) => {
            return a != undefined;
          }),
          dataLabels: { enabled: false },
          labels: newState.filter((a: any) => {
            return a != undefined;
          }),
          legend: { show: false },
          responsive: [{}],
          states: { hover: {} },
          stroke: { width: 0 },
          tooltip: { enabled: true },
        },
        postFix: '',
        series: newState.map(() => 1),
        statusColor: 'success',
      });
    } else {
      setDonutsExample(inicialStateDonuts);
    }
  }, [DashboardColors.colorsDonuts, DashboardColors.DonutsColorTitle]);

  useEffect(() => {
    updateForm(
      'barGraphicTitle',
      'barGraphicColor',
      DashboardColors.BartColorTitle,
      DashboardColors.colorsBart,
    );
    if (DashboardColors.colorsBart.length != 0) {
      const newState: any = DashboardColors.colorsBart.map(
        ({ label }) => label,
      );
      setBarExample([
        {
          labels: newState.filter((a: any) => {
            return a != undefined;
          }),
          Profit: newState.map(() => 50),
          Loss: ['0', '0'],
          colors: newState.filter((a: any) => {
            return a != undefined;
          }),
          titleBar: 'Example Bar',
          ColorTitle: DashboardColors.BartColorTitle || '#495057',
        },
      ]);
    } else {
      setBarExample(inicialStateBart);
    }
  }, [DashboardColors.colorsBart, DashboardColors.BartColorTitle]);

  const options: Object = {
    ColorTitle: DashboardColors.CardColorTitle || '#495057',
    chart: {
      height: 40,
      type: 'line',
      toolbar: { show: false },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: [DashboardColors.LineColor || '#0E113E'],
    },
    xaxis: {
      labels: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName: any) {
            return '';
          },
        },
      },
      marker: {
        show: false,
      },
    },
  };

  useEffect(() => {
    if (selectedRow) {
      setForm(selectedRow);
      setselectedFiles({
        logo: {
          url: itemVals('logo', selectedRow),
          blob: selectedFiles['logo']?.blob ?? '',
        },
        logoSmall: {
          url: itemVals('logoSmall', selectedRow),
          blob: selectedFiles['logoSmall']?.blob ?? '',
        },
        urlHome: {
          url: itemVals('urlHome', selectedRow),
          blob: selectedFiles['urlHome']?.blob ?? '',
        },
        urlLogin: {
          url: itemVals('urlLogin', selectedRow),
          blob: selectedFiles['urlLogin']?.blob ?? '',
        },
        urlFavicon: {
          url: itemVals('urlFavicon', selectedRow),
          blob: selectedFiles['urlFavicon']?.blob ?? '',
        },
      });
      setDashboardColors({
        CardColorTitle: selectedRow.lineGraphicTitle || '',
        LineColor: selectedRow.lineGraphicColor || '',
        DonutsColorTitle: selectedRow.donutGraphicTitle || '',
        colorsDonuts: selectedRow.donutGraphicColor || [],
        BartColorTitle: selectedRow.barGraphicTitle || '',
        colorsBart: selectedRow.barGraphicColor || [],
      });
    }
  }, [selectedRow]);

  const itemVals = (val: any, updateVal: any) => {
    for (const property in updateVal) {
      if (property === val) {
        return updateVal[property];
      }
    }
  };
  const onChangeHandler = (e: any, n: any) => {
    if (
      n === 'Email' ||
      n === 'Password' ||
      n === 'Host' ||
      n === 'Port' ||
      n === 'Accesstoken' ||
      n === 'secure'
    ) {
      n = smtp${n};
    }
    setForm({
      ...form,
      [n]: e.target.value,
    });
  };
  const updateStyle = (form: any) => {
    let theme;
    const brand = localStorage.getItem('brand');
    let newBrand;
    if (brand) {
      theme = JSON.parse(brand).theme;
      newBrand = JSON.parse(brand);
      newBrand.theme.primaryColor = form.primaryColor;
      newBrand.theme.secondaryColor = form.secondaryColor;
      newBrand.theme.primaryDarkColor = form.primaryDarkColor;
      newBrand.theme.secondaryDarkColor = form.secondaryDarkColor;
      newBrand.theme.sidebarBgColor = form.sidebarBgColor;
      newBrand.theme.headerBgColor = form.headerBgColor;
      newBrand.theme.headerDarkBgColor = form.headerDarkBgColor;
      localStorage.setItem('brand', JSON.stringify(newBrand));
    }
    updateStyleDocument();
  };
  const updateFinalClient = (form: any) => {
    updateStyle(form);
    onUpdateClient(form);
  };
  const onCancelPreview = () => {
    console.log('CANCEL.. selectedRow', selectedRow);
    let theme;
    const brand = localStorage.getItem('brand');
    let newBrand;
    if (brand) {
      theme = JSON.parse(brand).theme;
      newBrand = JSON.parse(brand);
      newBrand.theme.primaryColor = selectedRow.primaryColor;
      newBrand.theme.secondaryColor = selectedRow.secondaryColor;
      newBrand.theme.primaryDarkColor = selectedRow.primaryDarkColor;
      newBrand.theme.secondaryDarkColor = selectedRow.secondaryDarkColor;
      newBrand.theme.sidebarBgColor = selectedRow.sidebarBgColor;
      newBrand.theme.headerBgColor = selectedRow.headerBgColor;
      newBrand.theme.headerDarkBgColor = selectedRow.headerDarkBgColor;
      localStorage.setItem('brand', JSON.stringify(newBrand));
    }
    const tmpForm = {
      primaryColor: selectedRow.primaryColor,
      secondaryColor: selectedRow.secondaryColor,
      primaryDarkColor: selectedRow.primaryDarkColor,
      secondaryDarkColor: selectedRow.secondaryDarkColor,
      sidebarBgColor: selectedRow.sidebarBgColor,
      headerBgColor: selectedRow.headerBgColor,
      headerDarkBgColor: selectedRow.headerDarkBgColor,
    };
    setForm({ ...form, ...tmpForm });
    updateStyleDocument();
  };

  const renderButtons = () => (
    <Buttons>
      <>
        <CancelButton
          className="button"
          onClick={() => onCancelPreview()}
          data-bs-toggle="tooltip"
        >
          <i
            className="bx bx-power-off"
            style={{ fontSize: '2.5em' }}
            data-bs-toggle="tooltip"
          ></i>
        </CancelButton>
        <UpdateButton
          className="button"
          disabled={flag}
          onClick={() => updateFinalClient(form)}
        >
          <i className="bx bx-sync" style={{ fontSize: '2.5em' }}></i>
        </UpdateButton>
        <UpdateButton
          className="button"
          disabled={flag}
          onClick={() => updateStyle(form)}
        >
          <i className="dripicons-preview" style={{ fontSize: '2.5em' }}></i>
        </UpdateButton>
      </>
    </Buttons>
  );

  useEffect(() => {
    const {
      logo,
      logoSmall,
      primaryColor,
      secondaryColor,
      primaryDarkColor,
      secondaryDarkColor,
      sidebarBgColor,
      headerBgColor,
      headerDarkBgColor,
    } = form;
    if (
      primaryColor != '' &&
      secondaryColor != '' &&
      primaryDarkColor != '' &&
      secondaryDarkColor != '' &&
      sidebarBgColor != '' &&
      headerBgColor != '' &&
      headerDarkBgColor != ''
    ) {
      setflag(false);
    } else {
      setflag(true);
    }
  }, [form]);

  /* UPLOAD IMAGES */

  const colors = {
    primaryColor: false,
    secondaryColor: false,
    sidebarBgColor: false,
    headerBgColor: false,
    primaryDarkColor: false,
    secondaryDarkColor: false,
    headerDarkBgColor: false,
  };

  const [selectedFiles, setselectedFiles] = useState<any>({
    logo: { url: '', blob: '' },
    logoSmall: { url: '', blob: '' },
    urlHome: { url: '', blob: '' },
    urlLogin: { url: '', blob: '' },
    urlFavicon: { url: '', blob: '' },
  });

  const [verticalActiveTab, setverticalActiveTab] = useState('BrandColors');
  const [dropdownActive, setDropDownActive] = useState<any>(colors);
  const [popUpState, setpopUpState] = useState(false);

  const isDarkColor = (color: any) => {
    if (color === 'null') color = '#000000';
    const r = parseInt(color?.substring(1, 3), 16);
    const g = parseInt(color?.substring(3, 5), 16);
    const b = parseInt(color?.substring(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  const toggleVertical = (tab: any) => {
    if (verticalActiveTab !== tab) {
      setverticalActiveTab(tab);
    }
  };

  const dropzonProps = ({ nameVal = '' }: any) => {
    const object: DropzoneOptions = {
      accept: { 'image/jpeg': ['.png', '.gif', '.jpeg', '.jpg'] },
      multiple: false,
      noDrag: true,
      onDrop: (acceptedFiles: any) => {
        handleAcceptedFiles(acceptedFiles, nameVal);
      },
    };
    return object;
  };

  function handleAcceptedFiles(files: any, nameVal: any) {
    Swal.fire({
      icon: 'question',
      title: 'Do you want to save ?',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        let urk = '';
        files.map((file: any) => (urk = URL.createObjectURL(file)));
        const newObject = { ...selectedFiles };
        newObject[nameVal].blob = urk;
        newObject[nameVal].url = '';
        dispatch(
          updateImageClients({
            file: files[0],
            networkId: form.company,
            nameField: nameVal,
          }),
        );
        setselectedFiles(newObject);
        Swal.fire('Saved!', '', 'success');
      }
    });
  }

  const TabPaneLogo = (name: string) => {
    return (
      <div className="pt-4 row align-items-center">
        <div className="col-4">
          {selectedFiles[name]?.url?.trim() ? (
            <Dropzone {...dropzonProps({ nameVal: name })}>
              {({ getRootProps, getInputProps }) => (
                <div className="pb-1" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className="cursor-pointer d-flex justify-content-center">
                    <img
                      style={{ maxWidth: 251 }}
                      height={150}
                      alt={name}
                      src={
                        selectedFiles[name]?.blob.length === 0
                          ? selectedFiles[name]?.url
                          : selectedFiles[name]?.blob
                      }
                    />
                  </div>
                </div>
              )}
            </Dropzone>
          ) : null}
        </div>
        <div className="col-6">
          <IInput
            title={name}
            valid={false}
            value={selectedFiles[name]?.url}
            type={'text'}
            readonly={true}
            onChangeHandler={onChangeHandler}
          />
        </div>
        <div className="col-1">
          <Form style={{ marginLeft: -50 }}>
            <Dropzone {...dropzonProps({ nameVal: name })}>
              {({ getRootProps, getInputProps }) => (
                <div className="dz-message needsclick mt-2" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className="cursor-pointer btn waves-effect">
                    <i className="display-5 bx bx-image-add bx-tada-hover" />
                  </div>
                </div>
              )}
            </Dropzone>
          </Form>
        </div>
      </div>
    );
  };

  const InfoColor = (name: any) => {
    const infoColors: any = {
      primaryColor:
        'Change the titles in the menu. Change the selected titles. Change the main buttons. Change the table headers. Change the alert headers',
      secondaryColor: 'Change the subtitle fonts',
      sidebarBgColor: 'Change the menu. Change the icons',
      headerBgColor: 'Change the top part of the page',
      primaryDarkColor: 'Change the loading icon',
      secondaryDarkColor:
        'Change the hover effect on a button. Change the permissions menu icon',
      headerDarkBgColor: '',
    };
    return (
      <>
        {infoColors[name]?.split('. ').map((item: any) => {
          return <div className="">{item ? '- ' + item + '.' : null}</div>;
        })}
      </>
    );
  };

  return (
    <>
      <div>
        <Col lg={12}>
          <Card>
            <CardBody>
              <Nav tabs className="navStyle">
                <NavItem>
                  <NavLink
                    className={classnames({
                      'mb-2 cursor-pointer colorTextConfigBrand ': true,
                      active: verticalActiveTab === 'Logo',
                    })}
                    onClick={() => {
                      toggleVertical('Logo');
                    }}
                  >
                    Logo
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      'mb-2 cursor-pointer colorTextConfigBrand navStyleItem':
                        true,
                      active: verticalActiveTab === 'logoSmall',
                    })}
                    onClick={() => {
                      toggleVertical('logoSmall');
                    }}
                  >
                    Logo Small
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      'mb-2 cursor-pointer colorTextConfigBrand': true,
                      active: verticalActiveTab === 'urlFavicon',
                    })}
                    onClick={() => {
                      toggleVertical('urlFavicon');
                    }}
                  >
                    Image FavIcon
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      'mb-2 cursor-pointer colorTextConfigBrand': true,
                      active: verticalActiveTab === 'urlHome',
                    })}
                    onClick={() => {
                      toggleVertical('urlHome');
                    }}
                  >
                    Image Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      'mb-2 cursor-pointer colorTextConfigBrand': true,
                      active: verticalActiveTab === 'urlLogin',
                    })}
                    onClick={() => {
                      toggleVertical('urlLogin');
                    }}
                  >
                    Image Login
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      'mb-2 cursor-pointer colorTextConfigBrand': true,
                      active: verticalActiveTab === 'BrandColors',
                    })}
                    onClick={() => {
                      toggleVertical('BrandColors');
                    }}
                  >
                    Brand Colors
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      'mb-2 cursor-pointer colorTextConfigBrand': true,
                      active: verticalActiveTab === 'Email',
                    })}
                    onClick={() => {
                      toggleVertical('Email');
                    }}
                  >
                    SMTP Email
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    className={classnames({
                      'mb-2 cursor-pointer colorTextConfigBrand': true,
                      active: verticalActiveTab === 'Dashboard Colors',
                    })}
                    onClick={() => {
                      toggleVertical('Dashboard Colors');
                    }}
                  >
                    Dashboard Colors
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent
                activeTab={verticalActiveTab}
                className="text-muted mt-4 mt-md-0"
              >
                <TabPane tabId="Logo">{TabPaneLogo('logo')}</TabPane>
                <TabPane tabId="logoSmall">{TabPaneLogo('logoSmall')}</TabPane>
                <TabPane tabId="urlFavicon">
                  {TabPaneLogo('urlFavicon')}
                </TabPane>
                <TabPane tabId="urlHome">{TabPaneLogo('urlHome')}</TabPane>
                <TabPane tabId="urlLogin">{TabPaneLogo('urlLogin')}</TabPane>

                <TabPane tabId="BrandColors">
                  <div className="row">
                    {arrayUpdAdd?.map((val: any) => {
                      const value = selectedRow ? itemVals(val, form) : null;
                      const fontDarker = isDarkColor(value);
                      return (
                        <>
                          <div className="col-3 pt-4 row text-center container-colors">
                            <div className="btn-group secondary">
                              <ButtonDropdown
                                toggle={() =>
                                  setDropDownActive({
                                    ...dropdownActive,
                                    [val]: !dropdownActive[val],
                                  })
                                }
                                className="ButtonDropdownHover"
                                isOpen={dropdownActive[val]}
                                onMouseEnter={() =>
                                  setDropDownActive({
                                    ...dropdownActive,
                                    [val]: true,
                                  })
                                }
                                onMouseLeave={() =>
                                  setDropDownActive({
                                    ...dropdownActive,
                                    [val]: false,
                                  })
                                }
                              >
                                <Label className="inputTextConfigBrand">
                                  <div
                                    className="position-absolute labelConfigBrand cursor-pointer text-capitalize"
                                    style={{
                                      color: fontDarker ? 'white' : 'black',
                                    }}
                                  >
                                    {val}
                                  </div>
                                  <Input
                                    type="color"
                                    className="cursor-pointer inputConfigBrand"
                                    placeholder={val}
                                    plaintext={true}
                                    value={value}
                                    onChange={(e: any) => {
                                      const n = val;
                                      setForm({
                                        ...form,
                                        [n]: e.target.value,
                                      });
                                      setDropDownActive({
                                        ...dropdownActive,
                                        [val]: false,
                                      });
                                    }}
                                  />
                                </Label>

                                <DropdownToggle
                                  className={classnames({
                                    DropdownToggle: true,
                                    DropdownToggleDark: !fontDarker,
                                  })}
                                  outline
                                  style={{ backgroundColor: value }}
                                  caret
                                >
                                  <div>
                                    <i
                                      className={classnames({
                                        'bx bx-info-circle pt-1': true,
                                        'bx-tada': dropdownActive[val],
                                      })}
                                      style={{
                                        color: fontDarker ? 'white' : 'black',
                                      }}
                                    />
                                  </div>
                                </DropdownToggle>
                                <DropdownMenu
                                  flip={true}
                                  className="position-absolute dropdownConfigBrand"
                                >
                                  {InfoColor(val)}
                                </DropdownMenu>
                              </ButtonDropdown>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </TabPane>

                <TabPane tabId="Email">
                  <div className="Container-TabEmail">
                    {ListEmail.map((i: keyof TabEmailType) => {
                      if (i !== 'smtpsecure') {
                        return (
                          <IInput
                            title={i.replace('smtp', '')}
                            valid={form[i] != '' ? true : false}
                            value={form[i]}
                            type={
                              i === 'smtpEmail' || i === 'smtpPassword'
                                ? i.replace('smtp', '')
                                : 'text'
                            }
                            onInputHandler={onChangeHandler}
                          />
                        );
                      } else {
                        return (
                          <div className="Container-Div-Switch">
                            <div className="ContainerSwitch">
                              <Label>
                                <p>Secure: </p>
                                <ISwitch
                                  title={'smtpsecure'}
                                  checked={Boolean(form.smtpsecure)}
                                  onChangeBooleanHandler={
                                    onChangeBooleanHandler
                                  }
                                />
                              </Label>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>

                  <div className="ButtonUpdateTabEmail">
                    <UpdateButton
                      className="button"
                      disabled={false}
                      onClick={() => {
                        onUpdateClient(form);
                      }}
                    >
                      <i
                        className="bx bx-sync"
                        style={{ fontSize: '2.5em' }}
                      ></i>
                    </UpdateButton>
                  </div>
                </TabPane>

                <TabPane tabId="Dashboard Colors">
                  <div className="ConteineDashboardColorsr">
                    {DashboardColorsMap.map((item: any) => {
                      const title: string =
                        item.campos && item.campos.namePropTitle
                          ? item.campos.namePropTitle
                          : null;
                      const Colors: string =
                        item.campos && item.campos.namePropColors
                          ? item.campos.namePropColors
                          : null;
                      if (item.title) {
                        return (
                          <div className="CardsColorInput">
                            <h4 className="titleDashboardColors">
                              {item.title}
                            </h4>
                            <div className="ConteinerInputsColor">
                                <MultiColor TextLabel={item.campos.TituloCampo1} updateColors={onChangeHandlerMultiColors} name={title} isMulti={item.campos.isMulti1}/>
                                <MultiColor TextLabel={item.campos.TituloCampo2} updateColors={onChangeHandlerMultiColors} name={Colors} isMulti={item.campos.isMulti2}/>
                            </div>
                            {item.campos &&
                            item.campos.isMulti2 &&
                            (DashboardColors[
                              Colors as keyof DashboardColorsState
                            ] as string | undefined) &&
                            DashboardColors[
                              Colors as keyof DashboardColorsState
                            ].length > 0 ? (
                              <Select
                                value={
                                  DashboardColors[
                                    Colors as keyof DashboardColorsState
                                  ] as string | undefined
                                }
                                isMulti={true}
                                isSearchable={false}
                                options={''}
                                onChange={(e: any) => {
                                  setDashboardColors({
                                    ...DashboardColors,
                                    [Colors]: e,
                                  });
                                }}
                                classNamePrefix="select2-selection"
                              />
                            ) : null}
                            <div></div>
                          </div>
                        );
                      } else {
                        switch (item.grafica) {
                          case 'Line':
                            return (
                              <div>
                                <Row className="LineGrafica">
                                  <Widgets
                                    options={options}
                                    items={LineExample}
                                  />
                                </Row>
                              </div>
                            );
                          case 'Donuts':
                            return (
                              <div>
                                <Row className="DonutsGrafica">
                                  <Col xl={6} md={6} key={1}>
                                    <Orders item={DonutsExample} />
                                  </Col>
                                </Row>
                              </div>
                            );
                          case 'Bart':
                            return (
                              <div>
                                <Row className="BartGrafica">
                                  <MarketOverview items={BarExample} />
                                </Row>
                              </div>
                            );
                        }
                      }
                    })}
                  </div>
                  <div className="ButtonUpdateTabEmail">
                    <UpdateButton
                      className="button"
                      disabled={false}
                      onClick={() => {
                        onUpdateClient(form);
                      }}
                    >
                      <i
                        className="bx bx-sync"
                        style={{ fontSize: '2.5em' }}
                      ></i>
                    </UpdateButton>
                  </div>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
        {verticalActiveTab === 'BrandColors' ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginRight: '1%',
            }}
          >
            {renderButtons()}
          </div>
        ) : null}
      </div>
    </>
  );
};

FormClientBrandCustom.propTypes = {
  selectedRow: PropTypes.object,
  onUpdateClient: PropTypes.func,
  onCancel: PropTypes.func,
};

export default FormClientBrandCustom;