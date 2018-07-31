import React, {
  Children,
  PropTypes,
  Component,
} from 'react';
import { AsyncStorage, View } from 'react-native';
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client';
import authentication from 'feathers-authentication/client';
import io from './utils/socket-io';
import contextShape from './utils/contextShape';
import { TopBanner } from './TopBanner';
import * as services from 'AppServices';
import { ConnectionError } from 'AppConstants';

export class FeathersWrapper extends Component {
  static propTypes = {
    children: PropTypes.any,
    wsEndpoint: PropTypes.string,
    loader: PropTypes.any,
    timeout: PropTypes.number
  };

  static defaultProps = {
    wsEndpoint: 'http://127.0.0.1:3030',
    reconnection: true,
    loader: null,
    timeout: null,
  };

  static childContextTypes = {
    feathers: contextShape
  };

  constructor(props, context) {
    super(props, context);
    const options = {
      transports: ['websocket'],
      forceNew: true,
      reconnectionDelay: 10,
      reconnection: true
    };
    const socket = io(props.wsEndpoint, options);
    this._initialized = false;
    this._connected = false;
    this._showMessage = false;
    this._showBanner = false;
    this._addTimeout = ::this._addTimeout;
    this._clearTimeout = ::this._clearTimeout;
    this.app = feathers()
    .configure(socketio(socket, { timeout: props.timeout }))
    .configure(hooks())
    .configure(authentication({
      storage: AsyncStorage
    }));

    const self = this;
    for (const service of Object.values(services)) {
      this.app.service(service).before({
        all: [
          function checkConnection(hook) {
            if (!self._connected) {
              if (!self._showMessage) {
                self._showMessage = true;
                self._messageTimeout = setTimeout(() => {
                  self._showMessage = false;
                  delete self._messageTimeout;
                  self.forceUpdate();
                }, 2000);
                self.forceUpdate();
              }
              throw new ConnectionError('Connection lost!');
            }

            return hook;
          }
        ]
      });
    }
  }

  getChildContext() {
    return { feathers: this.app };
  }

  componentDidMount() {
    if (this.props.timeout) {
      this._addTimeout(this.props.timeout);
    }

    this.app.io.on('connect', () => {
      this._initialized = true;
      this._showMessage = false;
      this._clearTimeout();
      this.forceUpdate();
      this.app.authenticate()
        .finally(() => {
          this._connected = true;
        });
    });
    this.app.io.on('disconnect', () => {
      this._connected = false;
      // this.forceUpdate();
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this._clearTimeout();
  }

  _addTimeout(ms) {
    if (ms > 0) {
      this._timeout = setTimeout(() => {
        this._initialized = true;
        delete this._timeout;
        this.forceUpdate();
      }, ms);
    }
  }

  _clearTimeout() {
    if (this._timeout) {
      clearTimeout(this._timeout);
      delete this._timeout;
    }
    if (this._messageTimeout) {
      clearTimeout(this._messageTimeout);
      delete this._messageTimeout;
    }
  }

  render() {
    const {
      children,
      loader
    } = this.props;

    if (! this._initialized) {
      return loader;
    }

    return (<View style={{ flex: 1 }}>
      {Children.only(children)}
      </View>
    );
  }
}
