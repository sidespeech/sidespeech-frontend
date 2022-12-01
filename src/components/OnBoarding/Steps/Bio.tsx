import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

//redux
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../../../redux/Slices/UserDataSlice';

// models
import { User } from '../../../models/User';

// ui component
import Button from '../../ui-components/Button';
import TextArea from '../../ui-components/TextArea';

// other
import { toast } from 'react-toastify';
import { breakpoints, size } from '../../../helpers/breakpoints';

const BioStyled = styled.div`
    padding: 0 2rem;
    margin-top: 2rem;
    .text-area-wrapper {
        width: 100%;
        ${breakpoints(
            size.md,
            `{
      max-width: 480px;
      margin: 0 auto;
    }`
        )}
    }
`;

export interface InitialStateBio {
    bio: string;
}
interface InitialErrorState {
    bio: boolean;
}

const initialStateError = {
    bio: true
};
const InitialStateBio = {
    bio: ''
};

type ChildProps = {
    updateCurrentStep: (step: number) => void;
};

export default function Bio({ updateCurrentStep }: ChildProps) {
    const [formData, setFormData] = useState<InitialStateBio>(InitialStateBio);
    const [errorData, setErrorData] = useState<InitialErrorState>(initialStateError);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    let bioLength = formData.bio.length;

    //#region Form handlers
    const onChangeBio = (event: any) => {
        const bio = event.target.value;
        validateBio(bio);
        setFormData({ ...formData, bio: bio });
    };

    const validateBio = (bio: string) => {
        const length = bio.length;
        const validLength = length <= 500;
        setErrorData({ ...errorData, bio: validLength });
        return validLength;
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
            // await apiService.updateUser(user.id, formData)

            // Update the step to go to that we are on.
            updateCurrentStep(3);

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

    const goBack = () => {
        return updateCurrentStep(1);
    };

    const validateForm = () => {
        return validateBio(formData.bio);
    };

    return (
        <BioStyled className="f-row form-area">
            <div className="">
                <div className="text-area-wrapper">
                    <TextArea
                        height={120}
                        bgColor="var(--input)"
                        glass={false}
                        placeholder={'Describe yourself'}
                        placeholderColor="var(--text)"
                        onChange={onChangeBio}
                        radius="10px"
                        maxLength={600}
                    />
                </div>
                {!errorData.bio && <div className="text-red">Max number of characters is 500.</div>}
            </div>

            <div className="actions">
                <Button classes={'mt-3 back'} width={'159px'} height={44} onClick={goBack} radius={10}>
                    Back
                </Button>

                {/* Submit Button */}
                <Button
                    classes={`mt-3 ${bioLength == 0 ? 'skip' : 'submit'}`}
                    width={'159px'}
                    height={44}
                    onClick={onSubmit}
                    radius={10}
                >
                    {bioLength == 0 ? 'Skip' : 'Continue'}
                </Button>
            </div>
        </BioStyled>
    );
}
