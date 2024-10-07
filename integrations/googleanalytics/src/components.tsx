import { createComponent, RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

type GARuntimeEnvironment = RuntimeEnvironment<{}, GASiteInstallationConfiguration>;

type GARuntimeContext = RuntimeContext<GARuntimeEnvironment>;

type GASiteInstallationConfiguration = {
	tracking_id?: string;
};

type GAState = GASiteInstallationConfiguration;

type GAProps = {
	siteInstallation: {
		configuration?: GASiteInstallationConfiguration;
	};
};

export type GAAction = { action: 'save.config' };

export const configBlock = createComponent<GAProps, GAState, GAAction, GARuntimeContext>({
	componentId: 'config',
	initialState: (props) => {
		const siteInstallation = props.siteInstallation;
		return {
			tracking_id: siteInstallation.configuration?.tracking_id ?? '',
		};
	},
	action: async (element, action, context) => {
		switch (action.action) {
			case 'save.config':
				const { api, environment } = context;
				const siteInstallation = environment.siteInstallation;
				if (!siteInstallation) {
					throw Error('No site installation found');
				}

				const configurationBody = {
					...siteInstallation.configuration,
					tracking_id: element.state.tracking_id,
				};
				await api.integrations.updateIntegrationSiteInstallation(
					siteInstallation.integration,
					siteInstallation.installation,
					siteInstallation.site,
					{
						configuration: {
							...configurationBody,
						},
					},
				);
				return element;
		}
	},
	render: async () => {
		return (
			<configuration>
				<input
					label="Client ID"
					hint={<text>The unique identifier of your GA app client.</text>}
					element={<textinput state="tracking_id" placeholder="Tracking ID" />}
				/>

				<divider />
				<input
					label=""
					hint=""
					element={
						<button
							style="primary"
							disabled={false}
							label="Save"
							tooltip="Save configuration"
							onPress={{
								action: 'save.config',
							}}
						/>
					}
				/>
			</configuration>
		);
	},
});
