/* eslint-disable object-shorthand */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../context/AuthProvider';
import { list } from '../utils/categoryService';
import { create } from '../utils/articleService';
import Modall from '../modals/NewCategory';
import NewCategoryButton from './NewCategoryButton';
import {
  Footer,
  FooterText,
  Title,
  HeaderTitle,
} from '../styles/themeStyledComponents.js';
import {
  Flexrow,
  FlexrowCategory,
  Right,
  FormGroup,
  InputLabel,
  Input,
  StyledTextArea,
  StyledSelect,
  StyledSelectAuthor,
  Message,
  StyledForm,
  StyledButton,
} from '../styles/ArticleStyling.js';

const NewArticle = () => {
  const { user, isLoggedIn } = useAuthContext();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [state, setState] = useState(false);
  const [categories, setCategories] = useState(null);
  const history = useHistory();

  const { register, errors, handleSubmit, formState } = useForm({
    mode: 'onBlur',
  });

  const handleCategoryChange = (e) => {
    setCategories(e.target.value);
  };

  const showModal = () => {
    setState(true);
  };

  const closeModal = () => {
    setState(false);
  };

  const handleModal = (e) => {
    e.preventDefault();
    setCategories([{ categories: categories }, ...categories]);
    setState(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await list();
      if (!data.success) {
        setError(data.error);
      } else {
        setCategories(data.data);
      }
    };
    fetchData();
  }, [setCategories]);

  const onSubmit = async (formData) => {
    const { data } = await create(formData);
    if (!data.success) {
      setError(data.message);
    } else {
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        history.push(`/articles/${data.data.id}`);
      }, 5000);
    }
  };

  return (
    user &&
    isLoggedIn && (
      <div>
        <HeaderTitle>
          <Title>Ny artikkel</Title>
        </HeaderTitle>
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Flexrow>
              <div>
                <InputLabel htmlFor="inpName">Tittel</InputLabel>
              </div>
              <Right>
                <Message valid={!errors.title}>
                  Legg inn tittel på artikkelen
                </Message>
              </Right>
            </Flexrow>
            <Input
              type="text"
              name="title"
              id="inpNavn"
              placeholder="Tittel"
              ref={register({
                required: true,
              })}
            />
          </FormGroup>
          <FormGroup>
            <Flexrow>
              <div>
                <InputLabel htmlFor="inpLeadParagraph">Ingress</InputLabel>
              </div>
              <Right>
                <Message valid={!errors.leadParagraph}>
                  Legg inn ingress på artikkelen
                </Message>
              </Right>
            </Flexrow>
            <StyledTextArea
              type="text"
              name="leadParagraph"
              id="inpLeadParagraph"
              placeholder="Ingress"
              ref={register({
                required: true,
              })}
            />
          </FormGroup>
          <FormGroup isInvalid={errors.content}>
            <Flexrow>
              <div>
                <InputLabel htmlFor="inpContent">Tekst</InputLabel>
              </div>
              <Right>
                <Message valid={!errors.content}>
                  Legg inn innhold på artikkelen
                </Message>
              </Right>
            </Flexrow>
            <StyledTextArea
              type="text"
              name="content"
              id="inpContent"
              placeholder="Tekst"
              ref={register({
                required: true,
              })}
            />
          </FormGroup>
          <FormGroup isInvalid={errors.categoryId}>
            <FlexrowCategory>
              <div>
                <InputLabel htmlFor="inpCategories">Kategori</InputLabel>
              </div>
              <Right>
                <Message valid={!errors.categoryId}>
                  Legg inn kategori på artikkelen
                </Message>
              </Right>
            </FlexrowCategory>
            <Flexrow>
              <div>
                <StyledSelect
                  name="categoryId"
                  id="inpCategories"
                  ref={register({
                    /* required: true, */
                  })}
                >
                  {categories &&
                    categories.map((category) => (
                      <option
                        name={category._id}
                        value={category._id}
                        key={category._id}
                      >
                        {category.name}
                      </option>
                    ))}
                </StyledSelect>
              </div>
              <Right>
                <div>
                  <Modall
                    state={state}
                    close={closeModal}
                    handleCategoryChange={handleCategoryChange}
                    handleModal={handleModal}
                    setModalOpen={closeModal}
                  />

                  <NewCategoryButton modalHandler={showModal} />
                </div>
              </Right>
            </Flexrow>
          </FormGroup>
          <FormGroup isInvalid={errors.author}>
            <Flexrow>
              <div>
                <InputLabel htmlFor="inpAuthor">Forfatter</InputLabel>
              </div>
              <Right>
                <Message valid={!errors.author}>
                  Legg inn forfatter på artikkelen
                </Message>
              </Right>
            </Flexrow>
            <StyledSelectAuthor
              name="author"
              id="inpAuthor"
              ref={register({
                required: true,
              })}
            >
              <option value="Lars Larsen">Lars Larsen</option>
              <option value="Gunn Gundersen">Gunn Gundersen</option>
              <option value="Simen Simensen">Simen Simensen</option>
            </StyledSelectAuthor>
          </FormGroup>
          <FormGroup isInvalid={errors.isClassified}>
            <Flexrow>
              <div>
                <InputLabel htmlFor="inpIsClassified">Hemmelig</InputLabel>
              </div>
              <Right>
                <Message valid={!errors.isClassified}>
                  Legg inn classified på artikkelen
                </Message>
              </Right>
            </Flexrow>
            <Right>
              <input
                type="checkbox"
                defaultChecked={false}
                name="isClassified"
                ref={register}
              />
            </Right>
          </FormGroup>
          <input
            hidden
            type="text"
            name="adminId"
            id="inpNavn"
            ref={register({
              required: true,
            })}
            defaultValue={user._id}
          />
          <FormGroup>
            <StyledButton type="submit" isLoading={formState.isSubmitting}>
              CREATE
            </StyledButton>
            {error && <p>{error.message}</p>}
          </FormGroup>
        </StyledForm>
        <FormGroup>
          {success && (
            <div>
              <H1>
                Artikkel ble nå opprettet. Sender deg til redigeringssiden om 5
                sekunder.
              </H1>
            </div>
          )}
          {error && (
            <div>
              <h1>{error}</h1>
            </div>
          )}
        </FormGroup>
        <Footer>
          <FooterText>OrgnNr: 007 007 007</FooterText>
          <FooterText>Ig@Igror.no</FooterText>
          <FooterText>99 00 00 00</FooterText>
        </Footer>
      </div>
    )
  );
};

export default NewArticle;

const H1 = styled.h1`
  font-size: 32px;
  width: 500px;
  color: green;
`;
