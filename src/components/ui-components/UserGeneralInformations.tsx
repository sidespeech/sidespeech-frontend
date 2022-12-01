import React, { useEffect, useState } from 'react';
//redux
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { disconnect, updateUser } from '../../redux/Slices/UserDataSlice';
// models
import { User } from '../../models/User';
// ui component
import Button from '../ui-components/Button';
import InputText from '../ui-components/InputText';
import TextArea from '../ui-components/TextArea';
// icons
import closeWalletIcon from './../../assets/close-wallet.svg';
// other
import { toast } from 'react-toastify';
import { fixURL, reduceWalletAddress, validateBio, validateUsername } from '../../helpers/utilities';
import Eligibility from '../CurrentColony/settings/eligibility/eligibility';
import styled from 'styled-components';
import { Side } from '../../models/Side';
import { InitialStateUser } from '../GeneralSettings/Account/GeneralSettingsAccount';
import Avatar from '../GeneralSettings/Account/Avatar';
import { breakpoints, size } from '../../helpers/breakpoints';

const UserGeneralInformationsStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 2rem;
    & .user-info-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        ${breakpoints(
            size.md,
            `{
      flex-direction: row;
    }`
        )}
    }
    & .copy {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
    }
    & .closeWallet {
        margin-left: 20px;
        margin-top: 3px;
    }
    & .search-icon {
        top: 70px;
        right: 40px;
        background: var(--background);
    }
    & .user-nfts-options {
        ${breakpoints(
            size.lg,
            `{
                display: none;
            }`
        )}
        & button {
            background-color: var(--disable);
            ${breakpoints(
                size.md,
                `{
        max-width: 180px;
      }`
            )}
        }
    }
    & .submitArea {
        ${breakpoints(
            size.md,
            `{
      max-width: 180px;
    }`
        )}
        & .side-settings-submit-btn {
            display: none;
            ${breakpoints(
                size.lg,
                `{
        display: block;
      }`
            )}
        }
    }
`;

interface InitialErrorState {
    username: boolean;
    bio: boolean;
}

const initialStateError = {
    username: true,
    bio: true
};

interface IUserGeneralInformationsProps {
    currentSide?: Side;
    displayNftsCollection?: boolean;
    formData: InitialStateUser;
    leaveSide?: any;
    onSubmit: any;
    setDisplayNftsCollection?: any;
    setFormData: any;
    sideSettingsPage?: boolean;
    user?: User;
    userCollectionsData?: any;
}

export default function UserGeneralInformations({
    currentSide,
    displayNftsCollection,
    formData,
    leaveSide,
    onSubmit,
    setDisplayNftsCollection,
    setFormData,
    sideSettingsPage,
    user,
    userCollectionsData
}: IUserGeneralInformationsProps) {
    const [errorData, setErrorData] = useState<InitialErrorState>(initialStateError);

    const [collectionName, setCollectionName] = useState<string | undefined>(undefined);
    const [loginPage, setLoginPage] = useState<boolean>(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const walletAddress = window.ethereum.selectedAddress;

    useEffect(() => {
        if (formData.avatar) {
            setCollectionName(userCollectionsData[formData.avatar.token_address]?.name);
        }
    }, [formData]);

    //#region Form handlers

    const onChangeUsername = (event: any) => {
        const username = event.target.value;
        const isValid = validateUsername(username);
        setErrorData({ ...errorData, username: isValid });

        setFormData({ ...formData, username: username });
    };

    const onChangeBio = (event: any) => {
        const bio = event.target.value;
        const validLength = validateBio(bio);
        setErrorData({ ...errorData, bio: validLength });
        setFormData({ ...formData, bio: bio });
    };

    const handleCopyWalletAddress = () => {
        navigator.clipboard.writeText(walletAddress);
        toast.success('Address copied successfuly.', { toastId: 1 });
    };

    const logout = () => {
        dispatch(disconnect());
        navigate('/');
    };

    const renderAvatar = () => {
        return (
            <div className="user-info-header">
                <Avatar nft={formData.avatar} collectionName={collectionName} />
                {!displayNftsCollection && !user && (
                    <Button
                        width={'159px'}
                        height={46}
                        onClick={() => setDisplayNftsCollection(true)}
                        radius={10}
                        background={'var(--disable)'}
                        color={'var(--text)'}
                    >
                        Select an NFT
                    </Button>
                )}
            </div>
        );
    };

    const renderUsername = () => {
        return (
            <div className="f-column">
                <div className="text-primary-light mb-3 text fw-600">Username</div>
                <InputText
                    height={40}
                    width="100%"
                    bgColor="var(--input)"
                    glass={false}
                    placeholderColor="var(--text)"
                    placeholder={'Your username'}
                    defaultValue={user?.username || ''}
                    onChange={onChangeUsername}
                    radius="10px"
                />
                {!errorData.username && <div className="text-red"> Only letters and numbers</div>}
            </div>
        );
    };

    const renderBio = () => {
        return (
            <div className="f-column">
                <div className="text-primary-light mb-3 text fw-600">Bio</div>
                <TextArea
                    height={120}
                    width="100%"
                    bgColor="var(--input)"
                    glass={false}
                    placeholder={'Describe yourself'}
                    defaultValue={user?.bio || ''}
                    placeholderColor="var(--text)"
                    onChange={onChangeBio}
                    radius="10px"
                    maxLength={500}
                />
                {!errorData.bio && <div className="text-red">Max number of charactere is 500.</div>}
            </div>
        );
    };

    const renderConnectedWallet = () => {
        return (
            <div className="f-column">
                <div className="text-primary-light mb-3 text fw-600">Connected wallet</div>
                <div className="flex">
                    <div className="w-100 relative">
                        <InputText
                            height={40}
                            width="100%"
                            bgColor="var(--input)"
                            glass={false}
                            placeholder={reduceWalletAddress(user?.accounts || '')}
                            onChange={undefined}
                            disabled={true}
                            defaultValue={reduceWalletAddress(walletAddress)}
                            radius="10px"
                        />
                        <div className="copy" onClick={handleCopyWalletAddress}>
                            <p>Copy</p>
                            <svg
                                width="17"
                                height="21"
                                viewBox="0 0 17 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2 20.8184C1.45 20.8184 0.979 20.6227 0.587 20.2314C0.195667 19.8394 0 19.3684 0 18.8184V4.81836H2V18.8184H13V20.8184H2ZM6 16.8184C5.45 16.8184 4.97933 16.6227 4.588 16.2314C4.196 15.8394 4 15.3684 4 14.8184V2.81836C4 2.26836 4.196 1.79736 4.588 1.40536C4.97933 1.01403 5.45 0.818359 6 0.818359H15C15.55 0.818359 16.021 1.01403 16.413 1.40536C16.8043 1.79736 17 2.26836 17 2.81836V14.8184C17 15.3684 16.8043 15.8394 16.413 16.2314C16.021 16.6227 15.55 16.8184 15 16.8184H6Z"
                                    fill="var(--primary)"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="closeWallet cursor-pointer" onClick={logout}>
                        <img src={closeWalletIcon} />
                    </div>
                </div>
            </div>
        );
    };

    const renderUserNftsOptions = () => (
        <div className="user-nfts-options">
            <div className="text-primary-light mb-3 text fw-600">Public NFTs</div>
            <div className="text-secondary-dark mb-3 text fw-600">
                You have {formData.publicNfts?.length || 0} Public NFTs
            </div>
            <Button onClick={() => setDisplayNftsCollection(true)} width="100%">
                Edit my public NFTs
            </Button>
        </div>
    );

    const renderLeave = () => {
        return (
            <>
                {currentSide && (
                    <div onClick={leaveSide} className="text-red cursor-pointer">
                        Leave the side
                    </div>
                )}
            </>
        );
    };

    return (
        <UserGeneralInformationsStyled>
            {!currentSide ? (
                <>
                    {/* Username Section */}
                    {renderUsername()}
                    {/* Description Section */}
                    {renderBio()}
                </>
            ) : (
                renderAvatar()
            )}

            {/* Eligibility Section */}
            {currentSide && <Eligibility side={currentSide} />}

            {!currentSide && renderConnectedWallet()}

            {!currentSide && renderUserNftsOptions()}

            <div className="submitArea">
                <Button
                    classes={sideSettingsPage ? 'side-settings-submit-btn' : ''}
                    color={'var(--text)'}
                    disabled={sideSettingsPage && !Object.keys(formData.avatar || {}).length}
                    height={44}
                    onClick={onSubmit}
                    radius={10}
                    width={'100%'}
                >
                    Save
                </Button>
            </div>

            {/* Wallet Section */}
            {currentSide && renderLeave()}
        </UserGeneralInformationsStyled>
    );
}
