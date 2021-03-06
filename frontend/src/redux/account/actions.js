import ethers from "ethers";
import {TrustCare} from "TrustCare";

export const ACCOUNT_CONNECTED = 'ACCOUNT_CONNECTED';
export const ACCOUNT_CONNECTION_PENDING = 'ACCOUNT_CONNECTION_PENDING';
export const ACCOUNT_CONNECTION_FAILED = 'ACCOUNT_CONNECTION_FAILED';
export const ACCOUNT_CHANGED = 'ACCOUNT_CHANGED';


const TRUST_CARE_CONTRACT=process.env.REACT_APP_TRUST_CARE_CONTRACT;

async function getRoles(address) {
    console.log({TrustCare})
    const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
    const trustCare = await TrustCare.at(TRUST_CARE_CONTRACT, signer);

    let tab = [];
   if(await trustCare.isAdmin(address)) {
       tab.push('admin');
   }
   if (await trustCare.isDoctor(address)) {
       tab.push('doctor');
   }

   if(address === '0xDF24A39713ed06CDF6d4f7C1F76f67d932FCF64D') {
       tab.push('patient');
   }

    if(address === '0x00E3644053e637421AC1f0f1397Abb05e07ff27b') {
        tab.push('insurance');
    }

    return tab;
}

export function connectAccount() {
    return (dispatch) => {
        if (typeof window.ethereum === 'undefined') {
            dispatch(accountConnectionFailed('MetaMask is not installed'));
            return;
        }
        dispatch(accountConnectionPending())
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(async accounts => {
            dispatch(accountConnected(accounts[0], await getRoles(accounts[0])))
            window.ethereum.on('accountsChanged', async function (accounts) {
                dispatch(accountChanged(accounts[0], await getRoles(accounts[0])))
            });

        }).catch(error => {
            console.error(error);
            dispatch(accountConnectionFailed(error.message))
        })
    }
}


export function accountConnectionFailed(error) {
    return {
        type: ACCOUNT_CONNECTION_FAILED,
        error
    }
}

export function accountConnected(address, roles) {
    return {
        type: ACCOUNT_CONNECTED,
        address,
        roles
    }
}

export function accountConnectionPending() {
    return {
        type: ACCOUNT_CONNECTION_PENDING
    }
}

export function accountChanged(address, roles) {
    return {
        type: ACCOUNT_CHANGED,
        address,
        roles
    }
}
