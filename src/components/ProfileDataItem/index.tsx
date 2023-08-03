import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { UserData } from '../../@types/interfaces';
import { useNavigation } from '@react-navigation/native';
import {
	Avatar,
	DataContainer,
	ProfileDataItemContainer,
	ProfileText,
	BackButton,
	BackContainer,
	HistoryButton,
	HistoryButtonText,
	ButtonContainer,
} from './styles';
import RepositoryList from '../RepositoryList';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
	History: undefined;
	historylist: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	'History'
>;

function ProfileDataList({ userData }: { userData: UserData }) {
	const navigation = useNavigation<HomeScreenNavigationProp>();
	const [reposData, setReposData] = useState([]);
	const [loading, setLoading] = useState(true);

	const handleGoBack = () => {
		navigation.goBack();
	};

	const handleViewHistory = () => {
		navigation.navigate('historylist');
	};

	useEffect(() => {
		const fetchReposData = async () => {
			try {
				const response = await axios.get(userData.repos_url);
				setReposData(response.data);
				setLoading(false);
			} catch (error) {
				console.error('Erro ao obter dados dos repositórios:', error);
				setLoading(false);
			}
		};

		fetchReposData();
	}, [userData.repos_url]);

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" color="#000" />
			</View>
		);
	}

	return (
		<View>
			<ButtonContainer>
				<BackContainer onPress={handleGoBack}>
					<BackButton>Back</BackButton>
				</BackContainer>
				<HistoryButton onPress={handleViewHistory}>
					<HistoryButtonText>Ver histórico</HistoryButtonText>
				</HistoryButton>
			</ButtonContainer>
			<ProfileDataItemContainer>
				<Avatar source={{ uri: userData.avatar_url }} />
				<DataContainer>
					<ProfileText>Name: {userData.name}</ProfileText>
					<ProfileText>Login: {userData.login}</ProfileText>
					<ProfileText>Location: {userData.location}</ProfileText>
					<ProfileText>ID: {userData.id}</ProfileText>
					<ProfileText>Followers: {userData.followers}</ProfileText>
					<ProfileText>Public Repos: {userData.public_repos}</ProfileText>
				</DataContainer>
				<RepositoryList reposData={reposData} />
			</ProfileDataItemContainer>
		</View>
	);
}

export default ProfileDataList;
