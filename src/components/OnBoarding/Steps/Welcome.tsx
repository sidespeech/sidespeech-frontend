import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../redux/Slices/UserDataSlice';
import Button from '../../ui-components/Button';
import InputText from '../../ui-components/InputText';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import greenCheckIcon from '../../../assets/check-green.svg';
import dangerIcon from '../../../assets/dangerous.svg';
import { breakpoints, size } from '../../../helpers/breakpoints';
import userService from '../../../services/api-services/user.service';

const WelcomeStyled = styled.div`
    .wrapper {
        gap: 1rem;
        margin: 2rem 0;
        padding: 0 2rem;
        .input-wrapper {
            margin: 0 auto;
            width: 100%;
            ${breakpoints(
                size.md,
                `{
        width: 480px;
      }`
            )}
        }
        .requirements {
            margin-top: 30px;
            & .rule {
                display: inline-block;
                margin: 0.5rem;
                position: relative;
                &:before {
                    content: '';
                    position: absolute;
                    width: 24px;
                    height: 24px;
                    background: url(${greenCheckIcon}) no-repeat;
                    background-size: 100%;
                    left: 0;
                    top: 0;
                }

                &.error:before {
                    background: url(${dangerIcon}) no-repeat;
                    background-size: 100%;
                    width: 20px;
                    height: 20px;
                }

                & p {
                    color: #b4c1d2;
                    margin: 0 2rem;
                }
            }
        }
    }
`;

export interface InitialStateUser {
    username: string;
}
interface InitialErrorState {
    username: boolean;
}

const initialStateError = {
    username: true
};
const initialStateUser = {
    username: ''
};

type ChildProps = {
    updateCurrentStep: (step: number) => void;
    updateChosenUsername: (username: string) => void;
};

export default function Welcome({ updateCurrentStep, updateChosenUsername }: ChildProps) {
    const [specialCharacters, setSpecialCharacters] = useState<boolean>(true);
    const [availableUsername, setAvailableUsername] = useState<boolean>(false);
    const [minMaxCharacters, setMinMaxCharacters] = useState<boolean>(false);

    const [formData, setFormData] = useState<InitialStateUser>(initialStateUser);
    const [errorData, setErrorData] = useState<InitialErrorState>(initialStateError);

    const dispatch = useDispatch();

    //#region Form handlers
    const onChangeUsername = async (event: any) => {
        const username = event.target.value;

        const re = new RegExp('^[a-zA-Z0-9]*$');
        const isValid = re.test(username);
        // Setting state of the min characters.
        username.length >= 5 && username.length <= 15 ? setMinMaxCharacters(true) : setMinMaxCharacters(false);

        if (minMaxCharacters) {
            const checkUsername = await userService.findExistingUsername(username);
            !checkUsername ? setAvailableUsername(true) : setAvailableUsername(false);
        }

        // Setting state of the special characters.
        isValid ? setSpecialCharacters(true) : setSpecialCharacters(false);

        setFormData({ ...formData, username: username });
    };

    //#region Submit functions

    const onSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please ensure all requirements met.', {
                toastId: 3
            });
            return false;
        }
        try {
            // Update the step to go to that we are on.
            updateCurrentStep(2);

            // Update the set username...
            updateChosenUsername(formData.username);

            dispatch(updateUser({ ...formData }));
        } catch (error) {
            toast.error('There has been an issue updating your account.', {
                toastId: 3
            });
            console.log(error);
        }
    };
    //#endregion

    //#region Form validation

    const validateForm = () => {
        return specialCharacters && minMaxCharacters && availableUsername ? true : false;
    };

    return (
        <WelcomeStyled className="f-row form-area">
            {/* Username Section */}
            <div className="wrapper f-column">
                <div className="input-wrapper">
                    <InputText
                        height={40}
                        width="100%"
                        bgColor="var(--input)"
                        glass={false}
                        color="#fff"
                        placeholderColor="var(--text)"
                        placeholder={'Your username'}
                        onChange={onChangeUsername}
                        radius="10px"
                        maxLength={15}
                    />
                </div>
                <div className="requirements">
                    <div className={`rule ${!specialCharacters ? 'error' : ''}`}>
                        <p>No special characters</p>
                    </div>
                    <div className={`rule ${!availableUsername ? 'error' : ''}`}>
                        <p>Available</p>
                    </div>
                    <div className={`rule ${!minMaxCharacters ? 'error' : ''}`}>
                        <p>Between 5 and 15 Characters</p>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="actions first-step">
                <div />
                <Button width={'121px'} height={44} onClick={onSubmit} radius={10} color={'var(--text)'}>
                    Continue{' '}
                </Button>
            </div>
        </WelcomeStyled>
    );
}
